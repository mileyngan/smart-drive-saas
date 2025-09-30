const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL ERROR: Supabase URL or Key is missing. Make sure they are set in the config.env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;