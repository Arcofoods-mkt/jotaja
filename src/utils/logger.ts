import { createClient } from '@/utils/supabase/client';

export type LogAction = 'Criar' | 'Editar' | 'Apagar' | 'Bloquear' | 'Desativar' | 'Ativar';

interface LogParams {
  action: LogAction;
  entity: string; // Módulo (ex: 'Leads', 'Usuários')
  entity_id?: string;
  description: string;
}

export const logAction = async (params: LogParams) => {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Nenhum usuário logado. Log não será salvo.');
      return;
    }
    
    const { error } = await supabase.from('logs').insert({
      user_id: user.id,
      action: params.action,
      entity: params.entity,
      entity_id: params.entity_id || null,
      details: {
        description: params.description
      }
    });
    
    if (error) {
      console.error('Erro ao salvar log:', error);
    }
  } catch (err) {
    console.error('Exceção ao tentar salvar log:', err);
  }
};
