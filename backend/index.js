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
        { user_id: req.user.id, category, color, location_text: locationText, lost_at: dateTime, description, private_verification_detail: req.body.privateDetail }
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
      .select('*, lost_items(*), found_items(*), handover_requests(*)');
      
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

// POST: Generate and send OTP for Account Verification
app.post('/api/verify-account/send-otp', authMiddleware, async (req, res) => {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const { error } = await supabase
      .from('verification_otps')
      .insert([{ user_id: req.user.id, code, expires_at: expiresAt }]);

    if (error) throw error;
    
    // In a real app, send this code via Email/SMS. Here we simulate success.
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST: Verify OTP
app.post('/api/verify-account/verify', authMiddleware, async (req, res) => {
  const { code } = req.body;
  try {
    const { data, error } = await supabase
      .from('verification_otps')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return res.status(400).json({ success: false, error: 'No OTP requested' });
    
    if (new Date() > new Date(data.expires_at)) {
      return res.status(400).json({ success: false, error: 'OTP expired' });
    }
    
    if (data.attempts >= 3) {
      return res.status(400).json({ success: false, error: 'Too many failed attempts. Request a new OTP.' });
    }

    if (data.code !== code) {
      await supabase.from('verification_otps').update({ attempts: data.attempts + 1 }).eq('id', data.id);
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    // Success - delete the OTP so it can't be reused
    await supabase.from('verification_otps').delete().eq('id', data.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST: Verify Ownership Private Detail
app.post('/api/verify-ownership', authMiddleware, async (req, res) => {
  const { matchId, privateDetail } = req.body;
  try {
    // 1. Get the match to find the lost report ID
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('lost_item_id')
      .eq('id', matchId)
      .single();

    if (matchError || !match) return res.status(404).json({ success: false, error: 'Match not found' });

    // 2. Get the lost item and check the private detail
    const { data: lostItem, error: lostError } = await supabase
      .from('lost_items')
      .select('user_id, private_verification_detail')
      .eq('id', match.lost_item_id)
      .single();

    if (lostError || !lostItem) return res.status(404).json({ success: false, error: 'Lost item not found' });
    if (lostItem.user_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized' });

    // Compare case-insensitive, trimmed
    const stored = (lostItem.private_verification_detail || '').trim().toLowerCase();
    const provided = (privateDetail || '').trim().toLowerCase();

    if (stored === provided && stored !== '') {
      res.json({ success: true });
    } else {
      // In a real app we would track attempts here in another table
      res.status(400).json({ success: false, error: 'Ownership verification could not be confirmed.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST: Request Handover
app.post('/api/handover/request', authMiddleware, async (req, res) => {
  const { matchId } = req.body;
  try {
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*, found_items(user_id)')
      .eq('id', matchId)
      .single();

    if (matchError || !match) return res.status(404).json({ success: false, error: 'Match not found' });

    const { error: insertError } = await supabase
      .from('handover_requests')
      .insert([{
        match_id: match.id,
        lost_report_id: match.lost_item_id,
        found_report_id: match.found_item_id,
        requester_id: req.user.id,
        finder_id: match.found_items.user_id,
        status: 'pending'
      }]);

    if (insertError) throw insertError;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST: Accept Handover
app.post('/api/handover/:id/accept', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the current user is the finder
    const { data: request, error: reqError } = await supabase
      .from('handover_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (reqError || !request) return res.status(404).json({ success: false, error: 'Request not found' });
    if (request.finder_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized' });

    const { error: updateError } = await supabase
      .from('handover_requests')
      .update({ status: 'accepted', updated_at: new Date() })
      .eq('id', id);

    if (updateError) throw updateError;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST: Decline Handover
app.post('/api/handover/:id/decline', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: request, error: reqError } = await supabase
      .from('handover_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (reqError || !request) return res.status(404).json({ success: false, error: 'Request not found' });
    if (request.finder_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized' });

    const { error: updateError } = await supabase
      .from('handover_requests')
      .update({ status: 'declined', updated_at: new Date() })
      .eq('id', id);

    if (updateError) throw updateError;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



