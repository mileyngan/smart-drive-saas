// backend/routes/users.js
const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const router = express.Router();
const { authenticateToken, checkRole } = require('../authMiddleware');

// @route   GET /api/users
// @desc    Get all users for the school (admin only)
router.get('/', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    // Get school_id from authenticated admin
    const {  profileData, error: profileError } = await supabase
      .from('profiles')
      .select('school_id')
      .eq('id', req.user.id)
      .single();

    if (profileError || !profileData) {
      return res.status(400).json({ message: 'Could not find school for admin' });
    }

    const schoolId = profileData.school_id;

    // Get all users for this school
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, role, license_number, bio')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;