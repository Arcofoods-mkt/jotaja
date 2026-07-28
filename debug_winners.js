const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qadasbyolsnyqdxunpas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZGFzYnlvbHNueXFkeHVucGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTM4OTYsImV4cCI6MjEwMDc4OTg5Nn0._n7SGq80FoFgZbcXvscEcyZjztSjodb5P9_QJoHylXw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: wData, error: wError } = await supabase
    .from('draw_winners')
    .select('*');

  console.log('Winners Data:', wData);
  console.log('Winners Error:', wError);
}

main();
