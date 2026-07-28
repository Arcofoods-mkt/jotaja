"use client";

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { createClient } from '@/utils/supabase/client';
import styles from './Categorias.module.css';

export default function CategoriasPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({ id: '', type: 'tipologia', name: '', color: '#94c41c' });
  const [isEditing, setIsEditing] = useState(false);

  const supabase = createClient();

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category: any = null) => {
    if (category) {
      setFormData(category);
      setIsEditing(true);
    } else {
      setFormData({ id: '', type: 'tipologia', name: '', color: '#94c41c' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await supabase.from('categories').update({
        type: formData.type,
        name: formData.name,
        color: formData.color
      }).eq('id', formData.id);
    } else {
      await supabase.from('categories').insert([{
        type: formData.type,
        name: formData.name,
        color: formData.color
      }]);
    }
    setIsModalOpen(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar?')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'type', label: 'Tipo', render: (row: any) => <span style={{ textTransform: 'capitalize' }}>{row.type}</span> },
    { 
      key: 'color', 
      label: 'Cor', 
      render: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className={styles.colorIndicator} style={{ backgroundColor: row.color }}></span>
          {row.color}
        </div>
      ) 
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (row: any) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className={styles.actionBtn} onClick={() => openModal(row)}>
            <FiEdit />
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(row.id)}>
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
          <h1 className="adminPageTitle">Categorias</h1>
          <p className="adminPageDescription">Gerencie as categorias disponíveis para participantes.</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <FiPlus /> Nova Categoria
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <AdminTable columns={columns} data={categories} searchPlaceholder="Pesquisar categoria..." />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Editar Categoria' : 'Nova Categoria'} maxWidth="50%">
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo</label>
            <select 
              className="input-field" 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
            >
              <option value="tipologia">Tipologia</option>
              <option value="tag">Tag</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Nome</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Ex: Restaurante"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Cor de destaque</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input 
                type="color" 
                className={styles.colorCircle} 
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                required
              />
              <span style={{ color: 'var(--text-muted)' }}>{formData.color.toUpperCase()}</span>
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
