// backend/routes/user.js
const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const router = express.Router();
const { authenticateToken, checkRole } = require('../authMiddleware');

// Generate random password
const generatePassword = () => {
  return Math.random().toString(36).slice(-8) + 'A1!';
};

// @route   POST /api/user
// @desc    Create a new user (student or instructor) - admin only
router.post('/', authenticateToken, checkRole('admin'), async (req, res) => {
  const { full_name, email, phone, role } = req.body;

  // Validate role
  if (!['student', 'instructor'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Use "student" or "instructor".' });
  }

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
    const password = generatePassword(); // Generate password

    // Create user in Supabase Auth
    const {  authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({ message: authError.message });
    }

    // Prepare profile data
    const profileDataToInsert = {
      id: authData.user.id,
      full_name,
      email,
      phone,
      role,
      school_id: schoolId
    };

    // Add instructor-specific fields if needed (license_number, bio)
    if (role === 'instructor') {
      // You can extend this later
    }

    // Insert into profiles
    const { error: profileInsertError } = await supabase
      .from('profiles')
      .insert(profileDataToInsert);

    if (profileInsertError) {
      console.error('Profile insert error:', profileInsertError);
      return res.status(400).json({ message: profileInsertError.message });
    }

    // Simulate sending email with password
    console.log(`📧 Credentials for ${email}: Password = ${password}`);

    // Send password to frontend for demo
    res.status(201).json({ 
      message: `${role === 'student' ? 'Learner' : 'Instructor'} created successfully`,
      user: authData.user,
      password
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

// @route   DELETE /api/user/:id
// @desc    Delete a user (admin only)
router.delete('/:id', authenticateToken, checkRole('admin'), async (req, res) => {
  const { id } = req.params;

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

    // Verify user belongs to this school
    const {  userData, error: userError } = await supabase
      .from('profiles')
      .select('school_id')
      .eq('id', id)
      .single();

    if (userError || !userData || userData.school_id !== profileData.school_id) {
      return res.status(403).json({ message: 'Cannot delete this user' });
    }

    // Delete from auth.users first
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) {
      console.error('Auth delete error:', authError);
      return res.status(400).json({ message: authError.message });
    }

    // Then delete from profiles (should cascade)
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;