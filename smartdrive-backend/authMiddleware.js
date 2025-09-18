// authMiddleware.js
const { supabase } = require('./lib/supabaseClient');

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: 'No token provided' });
  }

  supabase.auth.getUser(token)
    .then(({ data, error }) => { // 👈 DO NOT destructure { user } here
      if (error) {
        console.log("❌ Auth error:", error.message);
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!data || !data.user) {
        console.log("❌ No user found in auth response");
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = data.user; // 👈 Set req.user = data.user
      console.log("✅ User authenticated:", data.user.id);
      next();
    })
    .catch(err => {
      console.error('💥 authenticateToken error:', err);
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
        if (error) {
          console.log("❌ Role fetch error:", error.message);
          return res.status(403).json({ message: 'Access denied' });
        }
        if (!data || data.role !== requiredRole) {
          console.log(`❌ Access denied. Required: ${requiredRole}, Actual: ${data?.role}`);
          return res.status(403).json({ message: 'Access denied' });
        }
        console.log("✅ Role check passed:", data.role);
        next();
      })
      .catch(err => {
        console.error('💥 checkRole error:', err);
        res.status(500).json({ message: 'Internal server error' });
      });
  };
}

module.exports = { authenticateToken, checkRole };