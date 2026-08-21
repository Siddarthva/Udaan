const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

const supabaseUrl = env.supabase.url;
const supabaseKey = env.supabase.serviceRoleKey || env.supabase.anonKey;

const isPlaceholder = !supabaseUrl || !supabaseKey || 
                      supabaseUrl.includes('your-supabase-project-id') || 
                      supabaseKey.includes('your-supabase');

if (isPlaceholder) {
  throw new Error('FAIL: Supabase credentials in environment are empty or set to default placeholders.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

function getAuthClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

module.exports = { supabase, getAuthClient };
