const express = require('express'); 
const { supabase } = require('../lib/supabaseClient'); 
const router = express.Router(); 
const { authenticateToken, checkRole } = require('../authMiddleware'); 
 
router.get('/schools', authenticateToken, checkRole('super_admin'), async (req, res) => { 
  try { 
    const { data, error } = await supabase 
      .from('schools') 
      .select('*') 
      .eq('status', 'pending'); 
 
    if (error) { 
      console.error('Error fetching schools:', error); 
      return res.status(400).json({ message: error.message }); 
    } 
 
    res.json(data); 
  } catch (err) { 
    console.error('Server error:', err); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
}); 
 
router.put('/approve/:id', authenticateToken, checkRole('super_admin'), async (req, res) => { 
  const { id } = req.params; 
 
  try { 
    const { data, error } = await supabase 
      .from('schools') 
      .update({ 
        status: 'approved', 
        approved_at: new Date() 
      }) 
      .eq('id', id) 
      .select(); 
 
    if (error) { 
      console.error('Approval error:', error); 
      return res.status(400).json({ message: error.message }); 
    } 
 
    console.log('? School approved:', data[0]); 
 
    res.json({ 
      message: 'School approved successfully!', 
      school: data[0] 
    }); 
 
  } catch (err) { 
    console.error('Server error:', err); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
}); 
 
router.put('/reject/:id', authenticateToken, checkRole('super_admin'), async (req, res) => { 
  const { id } = req.params; 
 
  try { 
    const { data, error } = await supabase 
      .from('schools') 
      .update({ 
        status: 'rejected' 
      }) 
      .eq('id', id) 
      .select(); 
 
    if (error) { 
      console.error('Rejection error:', error); 
      return res.status(400).json({ message: error.message }); 
    } 
 
    console.log('? School rejected:', data[0]); 
 
    res.json({ 
      message: 'School rejected.', 
      school: data[0] 
    }); 
 
  } catch (err) { 
    console.error('Server error:', err); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
}); 
 
module.exports = router; 
