const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const router = express.Router();

// @route   POST /api/school/register
// @desc    Register a new driving school
router.post('/register', async (req, res) => {
  const { name, address, phone, email, deployment, subscription } = req.body;

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
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('School registration error:', error);
      return res.status(400).json({ message: error.message });
    }

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

// @route   GET /api/school/:id
// @desc    Get school details by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('schools')
      .select('name, address, phone, email')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching school:', error);
      return res.status(400).json({ message: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: 'School not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;