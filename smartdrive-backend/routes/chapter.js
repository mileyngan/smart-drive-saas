// backend/routes/chapter.js
const express = require('express');
const { supabase } = require('../lib/supabaseClient');
const router = express.Router();
const { authenticateToken, checkRole } = require('../authMiddleware');

// Get chapters by program (novice or recyclage)
router.get('/program/:programType', authenticateToken, checkRole('admin'), async (req, res) => {
  const { programType } = req.params;

  if (!['novice', 'recyclage'].includes(programType)) {
    return res.status(400).json({ message: 'Invalid program type' });
  }

  try {
    // Get school_id from authenticated admin
    const {  profileData, error: profileError } = await supabase
      .from('profiles')
      .select('school_id')
      .eq('id', req.user.id)
      .single();

    if (profileError || !profileData) {
      return res.status(400).json({ message: 'Could not find school' });
    }

    const schoolId = profileData.school_id;

    // Fetch chapters for this school and program
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('school_id', schoolId)
      .eq('program_type', programType)
      .order('chapter_order', { ascending: true });

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

module.exports = router;