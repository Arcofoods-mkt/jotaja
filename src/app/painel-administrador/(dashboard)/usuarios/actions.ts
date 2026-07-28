'use server'

import { createClient } from '@supabase/supabase-js'

export async function createAdminUser(formData: any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseKey) {
    return { error: 'A variável SUPABASE_SERVICE_ROLE_KEY não está configurada no arquivo .env.local. Ela é necessária para criar contas de usuário pelo painel.' }
  }

  const supabase = createClient(supabaseUrl!, supabaseKey)

  // 1. Criar Auth User
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
  })

  if (authError) return { error: `Erro na autenticação: ${authError.message}` }

  if (!authData.user) return { error: 'Falha ao criar o usuário de autenticação.' }

  // 2. Inserir no users_profiles
  const { error: profileError } = await supabase.from('users_profiles').insert({
    id: authData.user.id,
    name: formData.name,
    cpf: formData.cpf,
    role_id: formData.role_id || null,
    active: formData.active
  })

  if (profileError) {
    // Rollback: apaga o auth user se falhar ao criar o profile
    await supabase.auth.admin.deleteUser(authData.user.id)
    return { error: `Erro ao salvar perfil: ${profileError.message}` }
  }

  return { success: true }
}

export async function updateAdminUser(formData: any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseKey) {
    return { error: 'A variável SUPABASE_SERVICE_ROLE_KEY não está configurada no arquivo .env.local.' }
  }

  const supabase = createClient(supabaseUrl!, supabaseKey)

  // 1. Atualizar senha se houver
  if (formData.password) {
    const { error: authError } = await supabase.auth.admin.updateUserById(formData.id, {
      password: formData.password
    })
    if (authError) return { error: `Erro ao atualizar senha: ${authError.message}` }
  }

  // 2. Atualizar users_profiles
  const { error: profileError } = await supabase.from('users_profiles').update({
    name: formData.name,
    cpf: formData.cpf,
    role_id: formData.role_id || null,
    active: formData.active
  }).eq('id', formData.id)

  if (profileError) return { error: `Erro ao atualizar perfil: ${profileError.message}` }

  return { success: true }
}

export async function deleteAdminUser(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseKey) {
    return { error: 'A variável SUPABASE_SERVICE_ROLE_KEY não está configurada no arquivo .env.local.' }
  }

  const supabase = createClient(supabaseUrl!, supabaseKey)
  
  // Apagar users_profiles
  await supabase.from('users_profiles').delete().eq('id', id)
  
  // Apagar a conta do auth.users
  const { error } = await supabase.auth.admin.deleteUser(id)
  
  if (error) return { error: `Erro ao deletar autenticação: ${error.message}` }
  
  return { success: true }
}
