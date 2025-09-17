const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const { authenticateToken } = require('../authMiddleware');
const router = express.Router();

const generatePassword = () => {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
};

router.post('/create', authenticateToken, async (req, res) => {
  const { full_name, email, phone, role } = req.body; // role: 'instructor' or 'student'
  
  try {
    // 1. Get school_id from logged-in admin
    const {  profile, error: profileError } = await supabase
      .from('profiles')
      .select('school_id')
      .eq('id', req.user.id)
      .single();

    if (profileError) throw profileError;

    // 2. Generate password
    const password = generatePassword();

    // 3. Create auth user
    const {  authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 4. Create profile
    const { error: profileInsertError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        full_name,
        email,
        phone,
        role,
        school_id: profile.school_id
      }]);

    if (profileInsertError) throw profileInsertError;

    // 👇 LOG CREDENTIALS FOR DEMO
    console.log(`
      👤 USER CREDENTIALS GENERATED
      Name: ${full_name}
      Role: ${role}
      Email: ${email}
      Password: ${password}
      Login at: http://localhost:5173/smartdrive-frontend/login
    `);

    res.status(201).json({ 
      message: `${role} created successfully. Credentials sent via email.`,
      user: { email, password } 
    });

  } catch (error) {
    console.error('User creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;