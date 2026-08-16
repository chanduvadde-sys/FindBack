const { supabase } = require('../supabaseClient');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    }
    
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server error during authentication' });
  }
};

module.exports = authMiddleware;
