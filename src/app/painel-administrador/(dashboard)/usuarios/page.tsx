"use client";

import React, { useState, useEffect } from 'react';
import AdminModal from '@/components/admin/AdminModal';
import AdminTable from '@/components/admin/AdminTable';
import { FiPlus, FiEdit, FiTrash2, FiGrid, FiList } from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import { formatCPF } from '@/utils/formatters';
import { usePermissions } from '@/contexts/PermissionsContext';
import styles from './Usuarios.module.css';
import { createAdminUser, updateAdminUser, deleteAdminUser, getAdminUsersList } from './actions';
import { logAction } from '@/utils/logger';

export default function UsuariosPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Form State
  const defaultFormData = { 
    id: '', 
    name: '', 
    email: '', 
    cpf: '',
    password: '',
    role_id: '', 
    active: true
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);

  // Permissions
  const { permissions, isAdmin } = usePermissions();
  const perms = isAdmin ? { ver: true, editar: true, bloquear: true, excluir: true } : (permissions.Usuarios || {});

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    
    // Puxando usuários com e-mail mesclado pelo Server Action
    const result = await getAdminUsersList();
      
    if (result.data) {
      setUsers(result.data);
    }
    if (result.error) console.error("Error fetching admin users: ", result.error);

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

  const openModal = (user: any = null) => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf ? formatCPF(user.cpf) : '',
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
      id: formData.id,
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf.replace(/\D/g, ''), // Envia apenas os 11 números para o banco
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
      
      await logAction({
        action: isEditing ? 'Editar' : 'Criar',
        entity: 'Usuários',
        entity_id: formData.id || undefined,
        description: isEditing ? `Editou o usuário ${formData.name}` : `Criou o usuário ${formData.name}`
      });
      
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário: " + (error.message || "Verifique o console para mais detalhes."));
    }
  };

  const handleDelete = async (user: any) => {
    if (window.confirm('Tem certeza que deseja apagar permanentemente este usuário? O acesso dele será revogado.')) {
      const result = await deleteAdminUser(user.id);
      if (result.error) {
        alert("Erro ao deletar: " + result.error);
      } else {
        await logAction({
          action: 'Apagar',
          entity: 'Usuários',
          entity_id: user.id,
          description: `Excluiu o usuário ${user.name}`
        });
        fetchData();
      }
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Nome', 
      render: (row: any) => <span style={{ fontWeight: 600 }}>{row.name}</span>
    },
    { 
      key: 'email', 
      label: 'E-mail de Acesso',
      render: (row: any) => <span style={{ color: 'var(--text-color)' }}>{row.email || 'Não encontrado'}</span>
    },
    { 
      key: 'profile', 
      label: 'Permissão', 
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
          {perms.editar !== false && (
            <button className={styles.actionBtn} onClick={() => openModal(row)} title="Editar Usuário">
              <FiEdit />
            </button>
          )}
          {perms.excluir !== false && (
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(row)} title="Remover Acesso">
              <FiTrash2 />
            </button>
          )}
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
        <div className={styles.headerActions}>
          {perms.editar !== false && (
            <button className={styles.addBtn} onClick={() => openModal()}>
              <FiPlus /> Novo Usuário
            </button>
          )}
          <div className={styles.mobileViewToggles}>
            <button className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`} onClick={() => setViewMode('list')}><FiList /></button>
            <button className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.active : ''}`} onClick={() => setViewMode('grid')}><FiGrid /></button>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : perms.ver === false ? (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <p>Você não tem permissão para visualizar estas informações.</p>
        </div>
      ) : (
        <AdminTable columns={columns} data={users} searchPlaceholder="Pesquisar por nome ou email..." viewMode={viewMode} />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Editar Usuário' : 'Novo Usuário'}>
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nome Completo</label>
              <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail (Login)</label>
              <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>CPF (Obrigatório)</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.cpf} 
                onChange={(e) => setFormData({...formData, cpf: formatCPF(e.target.value)})} 
                placeholder="000.000.000-00"
                maxLength={14}
                required 
              />
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

            <div className={styles.formGroup}>
              <label className={styles.label}>Status do usuário</label>
              <div 
                className={styles.checkboxContainer} 
                onClick={() => { if (perms.bloquear !== false) setFormData({...formData, active: !formData.active}); }} 
                style={{ marginTop: '0.2rem', opacity: perms.bloquear === false ? 0.5 : 1, cursor: perms.bloquear === false ? 'not-allowed' : 'pointer' }}
              >
                <label className={styles.switch}>
                  <input type="checkbox" checked={formData.active} onChange={() => {}} disabled={perms.bloquear === false} />
                  <span className={styles.slider}></span>
                </label>
                <span>{formData.active ? 'Ativo' : 'Inativo'}</span>
              </div>
            </div>

          <div className="modal-actions">
            <button type="button" className="btn-danger" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
