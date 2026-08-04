'use server'

import { createClient } from '@supabase/supabase-js'

export async function getLogsList() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  if (supabaseUrl.endsWith('/rest/v1')) {
    supabaseUrl = supabaseUrl.replace('/rest/v1', '')
  }
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseKey) {
    return { error: 'Chave de serviço não configurada.' }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. Fetch logs
  const { data: logs, error: lError } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })

  if (lError) return { error: lError.message }

  // 2. Fetch users profiles to get names
  const { data: profiles, error: pError } = await supabase
    .from('users_profiles')
    .select('id, name')
    
  if (pError) return { error: pError.message }

  // 3. Fetch auth users to get emails
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) return { error: authError.message }

  // Merge emails and names into logs
  const mergedLogs = logs.map((log: any) => {
    const authUser = users.find(u => u.id === log.user_id)
    const profile = profiles.find(p => p.id === log.user_id)
    return {
      ...log,
      user_name: profile ? profile.name : 'Desconhecido',
      user_email: authUser ? authUser.email : 'Sem e-mail'
    }
  })

  return { data: mergedLogs }
}
