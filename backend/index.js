require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabase } = require('./supabaseClient');
const { calculateMatchScore } = require('./matcher');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FindBack API is running!');
});

// Basic /health route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST Lost Item
app.post('/api/lost-items', authMiddleware, async (req, res) => {
  const { category, color, locationText, dateTime, description } = req.body;
  try {
    // 1. Insert lost item linked to user
    const { data: lostItem, error: insertError } = await supabase
      .from('lost_items')
      .insert([
        { user_id: req.user.id, category, color, location_text: locationText, lost_at: dateTime, description }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Find potential matches among found items (bypassing RLS with service role)
    const { data: foundItems, error: foundError } = await supabase
      .from('found_items')
      .select('*')
      .eq('status', 'active');
      
    if (foundError) throw foundError;

    for (const foundItem of foundItems || []) {
      const score = await calculateMatchScore(lostItem, foundItem);
      if (score.totalScore >= 60) {
        await supabase
          .from('matches')
          .insert([{
            lost_item_id: lostItem.id,
            found_item_id: foundItem.id,
            category_score: score.categoryScore,
            location_score: score.locationScore,
            time_score: score.timeScore,
            text_score: score.textScore,
            total_score: score.totalScore
          }]);
      }
    }

    res.status(201).json({ success: true, item: lostItem });
  } catch (error) {
    console.error('Error creating lost item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Found Item
app.post('/api/found-items', authMiddleware, async (req, res) => {
  const { category, color, locationText, dateTime, description } = req.body;
  try {
    // 1. Insert found item linked to finder
    const { data: foundItem, error: insertError } = await supabase
      .from('found_items')
      .insert([
        { user_id: req.user.id, category, color, location_text: locationText, found_at: dateTime, description }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Find potential matches among lost items
    const { data: lostItems, error: lostError } = await supabase
      .from('lost_items')
      .select('*')
      .eq('status', 'active');

    if (lostError) throw lostError;

    for (const lostItem of lostItems || []) {
      const score = await calculateMatchScore(lostItem, foundItem);
      if (score.totalScore >= 60) {
        await supabase
          .from('matches')
          .insert([{
            lost_item_id: lostItem.id,
            found_item_id: foundItem.id,
            category_score: score.categoryScore,
            location_score: score.locationScore,
            time_score: score.timeScore,
            text_score: score.textScore,
            total_score: score.totalScore
          }]);
      }
    }

    res.status(201).json({ success: true, item: foundItem });
  } catch (error) {
    console.error('Error creating found item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET My Lost Items
app.get('/api/my-lost-items', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lost_items')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    res.json({ success: true, items: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Matches for a specific lost item
app.get('/api/matches/:lostItemId', authMiddleware, async (req, res) => {
  try {
    const { lostItemId } = req.params;
    
    // Ensure the lost item belongs to the user
    const { data: checkOwnership, error: ownError } = await supabase
      .from('lost_items')
      .select('user_id')
      .eq('id', lostItemId)
      .single();
      
    if (ownError || !checkOwnership || checkOwnership.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get matches WITH the found_items data joined
    const { data, error } = await supabase
      .from('matches')
      .select('*, found_items(*)')
      .eq('lost_item_id', lostItemId)
      .order('total_score', { ascending: false });
      
    if (error) throw error;
    
    // Flatten the response so the frontend receives it exactly like before
    const formattedMatches = data.map(m => ({
      ...m,
      category: m.found_items.category,
      color: m.found_items.color,
      location_text: m.found_items.location_text,
      found_at: m.found_items.found_at,
      description: m.found_items.description,
    }));
    
    res.json({ success: true, matches: formattedMatches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET My Reports (Lost and Found)
app.get('/api/my-reports', authMiddleware, async (req, res) => {
  try {
    const { data: lostData, error: lostError } = await supabase
      .from('lost_items')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
      
    if (lostError) throw lostError;

    const { data: foundData, error: foundError } = await supabase
      .from('found_items')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
      
    if (foundError) throw foundError;

    const lostItems = lostData.map(item => ({ ...item, type: 'Lost' }));
    const foundItems = foundData.map(item => ({ ...item, type: 'Found' }));

    const allReports = [...lostItems, ...foundItems].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ success: true, items: allReports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET My Messages (Matches involving my items)
app.get('/api/my-messages', authMiddleware, async (req, res) => {
  try {
    const { data: myLostItems } = await supabase.from('lost_items').select('id').eq('user_id', req.user.id);
    const { data: myFoundItems } = await supabase.from('found_items').select('id').eq('user_id', req.user.id);
    
    const lostIds = myLostItems?.map(i => i.id) || [];
    const foundIds = myFoundItems?.map(i => i.id) || [];
    
    if (lostIds.length === 0 && foundIds.length === 0) {
      return res.json({ success: true, messages: [] });
    }

    let query = supabase
      .from('matches')
      .select('*, lost_items(*), found_items(*)');
      
    if (lostIds.length > 0 && foundIds.length > 0) {
      query = query.or(`lost_item_id.in.(${lostIds.join(',')}),found_item_id.in.(${foundIds.join(',')})`);
    } else if (lostIds.length > 0) {
      query = query.in('lost_item_id', lostIds);
    } else {
      query = query.in('found_item_id', foundIds);
    }

    const { data: matches, error } = await query.order('created_at', { ascending: false });
      
    if (error) throw error;
    
    res.json({ success: true, messages: matches });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET My Analytics
app.get('/api/my-analytics', authMiddleware, async (req, res) => {
  try {
    const { data: lostData } = await supabase.from('lost_items').select('id, status').eq('user_id', req.user.id);
    const { data: foundData } = await supabase.from('found_items').select('id, status').eq('user_id', req.user.id);
    
    const lostCount = lostData?.length || 0;
    const foundCount = foundData?.length || 0;
    const totalReports = lostCount + foundCount;
    
    const recoveredLost = lostData?.filter(i => i.status === 'recovered' || i.status === 'closed').length || 0;
    const recoveredFound = foundData?.filter(i => i.status === 'recovered' || i.status === 'closed').length || 0;
    const successfulRecoveries = recoveredLost + recoveredFound;
    
    const lostIds = lostData?.map(i => i.id) || [];
    const foundIds = foundData?.map(i => i.id) || [];
    
    let pendingMatches = 0;
    let matchesFound = 0;
    
    if (lostIds.length > 0 || foundIds.length > 0) {
       let query = supabase.from('matches').select('id, status');
       if (lostIds.length > 0 && foundIds.length > 0) {
         query = query.or(`lost_item_id.in.(${lostIds.join(',')}),found_item_id.in.(${foundIds.join(',')})`);
       } else if (lostIds.length > 0) {
         query = query.in('lost_item_id', lostIds);
       } else {
         query = query.in('found_item_id', foundIds);
       }
       
       const { data: matchData } = await query;
       if (matchData) {
         matchesFound = matchData.length;
         pendingMatches = matchData.filter(m => !m.status || m.status === 'pending').length || matchData.length;
       }
    }
    
    res.json({ 
      success: true, 
      analytics: {
        totalReports,
        lostItems: lostCount,
        foundItems: foundCount,
        successfulRecoveries,
        matchesFound,
        pendingMatches
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



