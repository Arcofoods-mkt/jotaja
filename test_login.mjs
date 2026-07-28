import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'geovana.nascimento@arcofoods.com.br',
    password: 'password123'
  });

  if (error) {
    console.error('Login error:', error.message);
  } else {
    console.log('Login success!');
  }
}

testLogin();
