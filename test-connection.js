// Simple test script to verify Supabase connection
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://pdhehczqtdszltszuudk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4Eq6DOCfHmqP_9NJriYAiA_ffv_sXGy';

console.log('Testing Supabase connection...');
console.log('Project URL:', SUPABASE_URL);

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test the connection
async function testConnection() {
  try {
    console.log('Attempting to connect to Supabase...');
    
    // Try to fetch from the reviews table (will fail if table doesn't exist)
    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log('Connection test result - Error:', error.message);
      console.log('This is expected if the tables have not been created yet.');
    } else {
      console.log('Connection test result - Success!');
      console.log('Reviews table exists and is accessible.');
      console.log('Current review count:', count);
    }
  } catch (err) {
    console.log('Connection test result - Exception:', err.message);
  }
  
  try {
    // Try to fetch from the votes table (will fail if table doesn't exist)
    const { data, error, count } = await supabase
      .from('votes')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log('Votes table test - Error:', error.message);
      console.log('This is expected if the tables have not been created yet.');
    } else {
      console.log('Votes table test - Success!');
      console.log('Votes table exists and is accessible.');
      console.log('Current votes count:', count);
    }
  } catch (err) {
    console.log('Votes table test - Exception:', err.message);
  }
}

testConnection();