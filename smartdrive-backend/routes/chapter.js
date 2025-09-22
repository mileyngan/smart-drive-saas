// backend/routes/chapter.js
const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const router = express.Router();
const { authenticateToken, checkRole } = require('../authMiddleware');

// Get all chapters for a course
router.get('/course/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('course_id', courseId)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching chapters:', error);
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create chapter (admin only)
router.post('/', authenticateToken, checkRole('admin'), async (req, res) => {
  const { course_id, title, video_url, content } = req.body;

  try {
    const { data, error } = await supabase
      .from('chapters')
      .insert([{ course_id, title, video_url, content }])
      .select();

    if (error) {
      console.error('Error creating chapter:', error);
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({ message: 'Chapter created', chapter: data[0] });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;