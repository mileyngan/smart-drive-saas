const { supabase } = require('./lib/supabaseClient');

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  supabase.auth.getUser(token)
    .then(({ data: { user }, error }) => {
      if (error || !user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    })
    .catch(err => {
      console.error('authenticateToken error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
}

function checkRole(requiredRole) {
  return function (req, res, next) {
    supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data || data.role !== requiredRole) {
          return res.status(403).json({ message: 'Access denied' });
        }
        next();
      })
      .catch(err => {
        console.error('checkRole error:', err);
        res.status(500).json({ message: 'Internal server error' });
      });
  };
}

module.exports = { authenticateToken, checkRole };