"use client";

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiGrid, FiList } from 'react-icons/fi';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { createClient } from '@/utils/supabase/client';
import { usePermissions } from '@/contexts/PermissionsContext';
import styles from './Permissoes.module.css';
import { logAction } from '@/utils/logger';

export default function PermissoesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [roleName, setRoleName] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const defaultPermissions = {
    Dashboard: { acessar: false },
    Permissoes: { acessar: false, ver: false, editar: false, bloquear: false, excluir: false },
    Usuarios: { acessar: false, ver: false, editar: false, bloquear: false, excluir: false },
    Participantes: { acessar: false, ver: false, editar: false, bloquear: false, excluir: false },
    Categorias: { acessar: false, ver: false, editar: false, bloquear: false, excluir: false },
    Sorteios: { acessar: false, ver: false, editar: false, bloquear: false, excluir: false },
  };

  const [permissions, setPermissions] = useState<any>(defaultPermissions);

  // Permissions RBAC
  const { permissions: userPerms, isAdmin } = usePermissions();
  const perms = isAdmin ? { ver: true, editar: true, bloquear: true, excluir: true } : (userPerms.Permissoes || {});

  const supabase = createClient();

  const fetchRoles = async () => {
    const { data } = await supabase.from('roles').select('*').order('created_at', { ascending: true });
    if (data) setRoles(data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openModal = (role?: any) => {
    if (role) {
      setEditingRole(role);
      setRoleName(role.name);
      setPermissions({ ...defaultPermissions, ...(role.permissions || {}) });
    } else {
      setEditingRole(null);
      setRoleName('');
      setPermissions(defaultPermissions);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleToggle = (module: string, action: string) => {
    setPermissions((prev: any) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action]
      }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let savedId = editingRole ? editingRole.id : undefined;
    if (editingRole) {
      await supabase.from('roles').update({ name: roleName, permissions }).eq('id', editingRole.id);
      await logAction({ action: 'Editar', entity: 'Permissões', entity_id: savedId, description: `Editou o perfil de acesso ${roleName}` });
    } else {
      const { data } = await supabase.from('roles').insert([{ name: roleName, permissions }]).select('id');
      if (data && data.length > 0) savedId = data[0].id;
      await logAction({ action: 'Criar', entity: 'Permissões', entity_id: savedId, description: `Criou o perfil de acesso ${roleName}` });
    }
    closeModal();
    fetchRoles();
  };

  const handleDelete = async (row: any) => {
    if (row.name.toLowerCase() === 'admin') {
      alert('Ação bloqueada: O perfil Admin não pode ser excluído.');
      return;
    }
    
    // Relational check: check if any user is using this role
    const { data: linked } = await supabase
      .from('users_profiles')
      .select('id')
      .eq('role_id', row.id)
      .limit(1);

    if (linked && linked.length > 0) {
      if (!window.confirm('Existem usuários utilizando este perfil! A exclusão deixará esses usuários sem permissões. Tem certeza que deseja apagar MESMO ASSIM?')) {
        return;
      }
    } else {
      if (!window.confirm('Tem certeza que deseja excluir este Perfil?')) {
        return;
      }
    }

    await supabase.from('roles').delete().eq('id', row.id);
    await logAction({ action: 'Apagar', entity: 'Permissões', entity_id: row.id, description: `Apagou o perfil de acesso ${row.name}` });
    fetchRoles();
  };

  const renderModuleRow = (moduleName: string, actions: string[], displayName?: string) => {
    return (
      <div className={styles.moduleRow} key={moduleName}>
        <div className={styles.moduleName}>{displayName || moduleName}</div>
        <div className={styles.togglesContainer}>
          {actions.map(action => {
            const isChecked = permissions[moduleName] ? permissions[moduleName][action] : false;
            let label = 'Acessar';
            if (action === 'ver') label = 'Ver';
            if (action === 'editar') label = 'Editar/Criar';
            if (action === 'bloquear') label = 'Bloquear';
            if (action === 'excluir') label = 'Excluir';

            return (
              <div className={styles.toggleWrapper} key={action}>
                <label className={styles.switch}>
                  <input type="checkbox" checked={isChecked} onChange={() => handleToggle(moduleName, action)} />
                  <span className={styles.slider}></span>
                </label>
                <span className={styles.toggleLabel}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const columns = [
    { key: 'name', label: 'Nome do Perfil', render: (row: any) => <span style={{ fontWeight: 600 }}>{row.name}</span> },
    { key: 'created_at', label: 'Data de Criação', render: (row: any) => new Date(row.created_at).toLocaleDateString('pt-BR') },
    { 
      key: 'actions', 
      label: 'Ações', 
      render: (row: any) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {perms.editar !== false && (
            <button className="actionBtn" onClick={() => openModal(row)} title="Editar"><FiEdit /></button>
          )}
          {perms.excluir !== false && (
            <button className="actionBtn deleteBtn" onClick={() => handleDelete(row)} title="Excluir"><FiTrash2 /></button>
          )}
        </div>
      ) 
    }
  ];

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1 className="adminPageTitle">Perfis de Permissão</h1>
          <p className="adminPageDescription">Configure os níveis de acesso para os usuários do sistema.</p>
        </div>
        <div className={styles.headerActions}>
          {perms.editar !== false && (
            <button className={styles.addBtn} onClick={() => openModal()}>
              <FiPlus /> Novo Perfil
            </button>
          )}
          <div className={styles.mobileViewToggles}>
            <button className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`} onClick={() => setViewMode('list')}><FiList /></button>
            <button className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.active : ''}`} onClick={() => setViewMode('grid')}><FiGrid /></button>
          </div>
        </div>
      </div>

      {perms.ver === false ? (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <p>Você não tem permissão para visualizar estas informações.</p>
        </div>
      ) : (
        <AdminTable columns={columns} data={roles} searchPlaceholder="Pesquisar por nome de perfil..." viewMode={viewMode} />
      )}

      <AdminModal isOpen={isModalOpen} onClose={closeModal} title={editingRole ? 'Editar Perfil de Permissão' : 'Novo Perfil de Permissão'}>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label>Nome do Perfil *</label>
            <input 
              type="text" 
              className="input-field" 
              value={roleName} 
              onChange={(e) => setRoleName(e.target.value)} 
              required 
              placeholder="Ex: Visualizador"
            />
          </div>

          <div className={styles.permissionSection}>
            <h3 className={styles.permissionSectionTitle}>Permissões por Módulo</h3>
            <p className={styles.permissionSectionDesc}>Configure os níveis de acesso para este perfil utilizando os interruptores.</p>

            {renderModuleRow('Dashboard', ['acessar'], 'Dashboard')}
            {renderModuleRow('Permissoes', ['acessar', 'ver', 'editar', 'bloquear', 'excluir'], 'Permissões')}
            {renderModuleRow('Usuarios', ['acessar', 'ver', 'editar', 'bloquear', 'excluir'], 'Usuários')}
            {renderModuleRow('Participantes', ['acessar', 'ver', 'editar', 'bloquear', 'excluir'], 'Participantes')}
            {renderModuleRow('Categorias', ['acessar', 'ver', 'editar', 'bloquear', 'excluir'], 'Categorias')}
            {renderModuleRow('Sorteios', ['acessar', 'ver', 'editar', 'bloquear', 'excluir'], 'Sorteios')}

          </div>

          <div className="modal-actions">
            <button type="button" className="btn-danger" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
