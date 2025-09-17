const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('🔐 Login failed:', error.message);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 👇👇👇 FETCH USER PROFILE (INCLUDING ROLE) 👇👇👇
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profileData) {
      console.error('👤 Profile fetch error:', profileError);
      return res.status(400).json({ message: 'User profile not found' });
    }

    // Send token + user info + role to frontend
    res.json({
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profileData.role  // ← ✅ CRITICAL: RETURN ROLE
      }
    });

  } catch (err) {
    console.error('💥 Server error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;