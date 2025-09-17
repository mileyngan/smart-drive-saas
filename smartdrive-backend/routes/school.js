// routes/school.js
const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const router = express.Router();

// @route   POST /api/school/register
// @desc    Register a new driving school
router.post('/register', async (req, res) => {
  const { name, address, phone, email, deployment, subscription } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ message: 'School name and email are required' });
  }

  try {
    const { data, error } = await supabase
      .from('schools')
      .insert([
        {
          name,
          address: address || '',
          phone: phone || '',
          email,
          deployment: deployment || 'cloud',
          subscription: subscription || 'basic',
          status: 'pending' // Wait for super admin approval
        }
      ])
      .select();

    if (error) {
      console.error('School registration error:', error);
      return res.status(400).json({ message: error.message });
    }

    // TODO: In real app, send email to super admin
    console.log('✅ School registered, pending approval:', data[0]);

    res.status(201).json({
      message: 'School registered successfully. Waiting for super admin approval.',
      school: data[0]
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;