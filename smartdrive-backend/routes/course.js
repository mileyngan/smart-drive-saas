// backend/routes/course.js
const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const router = express.Router();
const { authenticateToken, checkRole } = require('../authMiddleware');

// Get all courses for the school
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

    // Get all courses for this school
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, description, image_url, instructor_name')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create course (admin only)
router.post('/', authenticateToken, checkRole('admin'), async (req, res) => {
  const { title, description, image_url, instructor_name } = req.body;

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

    const { data, error } = await supabase
      .from('courses')
      .insert([
        { 
          title, 
          description, 
          image_url: image_url || '', 
          instructor_name: instructor_name || 'Instructor',
          school_id: schoolId
        }
      ])
      .select();

    if (error) {
      console.error('Error creating course:', error);
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({ message: 'Course created', course: data[0] });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;