const { supabase } = require('./lib/supabaseClient'); 

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ message: 'Unauthorized' });

  req.user = user;
  next();
}

async function checkRole(requiredRole) {
  return async (req, res, next) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !data || data.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
}

module.exports = { authenticateToken, checkRole };
