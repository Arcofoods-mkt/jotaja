"use client";

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { createClient } from '@/utils/supabase/client';
import styles from './Usuarios.module.css';
import { createAdminUser, updateAdminUser, deleteAdminUser } from './actions';

export default function UsuariosPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const defaultFormData = { 
    id: '', 
    name: '', 
    email: '', 
    password: '',
    role_id: '', 
    active: true
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    
    // Puxando de users_profiles ao invés de admin_users
    // Como a sua tabela tem id que é foreign key para auth.users.id, 
    // precisaremos juntar os dados ou usar as roles
    const { data: pData, error: pError } = await supabase
      .from('users_profiles')
      .select(`
        *,
        profile:roles(name)
      `)
      .order('created_at', { ascending: false });
      
    if (!pError && pData) {
      // Como o e-mail não fica em users_profiles (fica em auth.users), a API admin é a única que consegue ver.
      // Para exibir no grid sem chamar RPC, vamos deixar um placeholder de e-mail por enquanto.
      // Ou você pode adicionar email como coluna em users_profiles para ser redundante, que é mais prático.
      setUsers(pData);
    }
    if (pError) console.error("Error fetching users_profiles: ", pError);

    // Fetch Profiles
    const { data: profData, error: profError } = await supabase.from('roles').select('*').order('name');
    if (!profError && profData) {
      setProfiles(profData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (user = null) => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        password: '', // Senha em branco ao editar por segurança
        role_id: user.role_id || '',
        active: user.active
      });
      setIsEditing(true);
    } else {
      setFormData(defaultFormData);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSave: any = {
      name: formData.name,
      email: formData.email,
      role_id: formData.role_id || null,
      active: formData.active
    };

    if (formData.password) {
      dataToSave.password = formData.password;
    }

    try {
      let result;
      if (isEditing) {
        result = await updateAdminUser(dataToSave);
      } else {
        result = await createAdminUser(dataToSave);
      }
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário: " + (error.message || "Verifique o console para mais detalhes."));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar permanentemente este usuário? O acesso dele será revogado.')) {
      const result = await deleteAdminUser(id);
      if (result.error) {
        alert("Erro ao deletar: " + result.error);
      } else {
        fetchData();
      }
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Nome Completo', 
      render: (row: any) => <span style={{ fontWeight: 600 }}>{row.name}</span>
    },
    { 
      key: 'email', 
      label: 'E-mail de Acesso',
      render: (row: any) => <span style={{ color: 'var(--text-muted)' }}>{row.email || 'Login oculto'}</span>
    },
    { 
      key: 'profile', 
      label: 'Perfil (Acesso)', 
      render: (row: any) => (
        row.profile ? (
          <span className={styles.badge} style={{ backgroundColor: 'rgba(148, 196, 28, 0.15)', color: 'var(--accent-color)', border: '1px solid rgba(148, 196, 28, 0.3)' }}>
            {row.profile.name}
          </span>
        ) : <span style={{ color: 'var(--text-muted)' }}>Sem perfil</span>
      )
    },
    { 
      key: 'active', 
      label: 'Status', 
      render: (row: any) => (
        <span className={`${styles.badge} ${row.active ? styles.badgeActive : styles.badgeInactive}`}>
          {row.active ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (row: any) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className={styles.actionBtn} onClick={() => openModal(row)} title="Editar Usuário">
            <FiEdit />
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(row.id)} title="Remover Acesso">
            <FiTrash2 />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1 className="adminPageTitle">Usuários</h1>
          <p className="adminPageDescription">Gerencie os membros da equipe e atribua perfis de permissão.</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <FiPlus /> Novo Usuário
        </button>
      </div>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <AdminTable columns={columns} data={users} searchPlaceholder="Pesquisar por nome ou email..." />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Editar Usuário' : 'Novo Usuário'} maxWidth="50%">
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome Completo</label>
              <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail (Login)</label>
              <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Perfil de Permissão</label>
              <select className="input-field" value={formData.role_id} onChange={(e) => setFormData({...formData, role_id: e.target.value})} required>
                <option value="">Selecione um perfil...</option>
                {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Senha de Acesso {isEditing ? '(Deixe em branco para manter)' : ''}</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="Digite a senha" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!isEditing} 
              />
            </div>

            <div className={styles.formGroupFull} style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <div className={styles.checkboxContainer} onClick={() => setFormData({...formData, active: !formData.active})}>
                <label className={styles.switch}>
                  <input type="checkbox" checked={formData.active} onChange={() => {}} />
                  <span className={styles.slider}></span>
                </label>
                Usuário com Acesso Ativo ao Painel
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-danger" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar Usuário</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
