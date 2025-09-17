const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const router = express.Router();

// Generate random password
const generatePassword = () => {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
};

router.post('/register', async (req, res) => {
  const { name, address, phone, email, subscription = 'basic', deployment = 'cloud' } = req.body;

  try {
    // 1. Create school
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .insert([{ name, address, phone, email, subscription, deployment }])
      .select()
      .single();

    if (schoolError) throw schoolError;

    // 2. Generate credentials for school admin
    const adminEmail = `admin@${name.replace(/\s+/g, '').toLowerCase()}.com`;
    const adminPassword = generatePassword();

    // 3. Create auth user for school admin
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    if (authError) throw authError;

    // 4. Link school to owner
    const { error: updateError } = await supabase
      .from('schools')
      .update({ owner_id: authData.user.id })
      .eq('id', school.id);

    if (updateError) throw updateError;

    // 5. Create profile for admin
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        full_name: `${name} Admin`,
        email: adminEmail,
        role: 'admin',
        school_id: school.id,
        phone: phone
      }]);

    if (profileError) throw profileError;

    // 👇 LOG CREDENTIALS FOR DEMO (Later: send via email)
    console.log(`
      🎓 SCHOOL ADMIN CREDENTIALS GENERATED
      School: ${name}
      Email: ${adminEmail}
      Password: ${adminPassword}
      Login at: http://localhost:5173/smartdrive-frontend/login
    `);

    res.status(201).json({ 
      message: 'School registered successfully. Admin credentials sent via email.',
      school,
      admin: { email: adminEmail, password: adminPassword }
    });

  } catch (error) {
    console.error('School registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;