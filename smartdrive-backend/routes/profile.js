const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabaseClient');  
const { authenticateToken } = require('../authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(400).json(error);
  res.json(data);
});

router.put('/', authenticateToken, async (req, res) => {
  const { full_name } = req.body;
  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name })
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(400).json(error);
  res.json(data);
});

module.exports = router;
