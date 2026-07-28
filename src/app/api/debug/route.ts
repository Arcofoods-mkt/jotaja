import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = createClient();
  const { data: dData, error: dError } = await supabase.from('draw_winners').select('*');
  const { data: pData, error: pError } = await supabase.from('draw_participants').select('*');

  return NextResponse.json({ draw_winners: dData, dError, draw_participants: pData, pError });
}
