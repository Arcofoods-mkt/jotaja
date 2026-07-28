const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('participants').select('id, personal_name, category_id, tag_id').limit(5);
  console.log('Participants:', data);
  const { data: cData } = await supabase.from('categories').select('id, name, type');
  console.log('Categories:', cData);
}

main();
