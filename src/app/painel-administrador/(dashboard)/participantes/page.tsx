"use client";

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiCopy } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { createClient } from '@/utils/supabase/client';
import styles from './Participantes.module.css';
import { COUNTRIES } from '@/utils/countries';
import { isValidCNPJ, formatCNPJ, formatPhone } from '@/utils/formatters';

export default function ParticipantesPage() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [categories, setCategories] = useState<{tipologias: any[], tags: any[]}>({tipologias: [], tags: []});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const defaultFormData = { 
    id: '', 
    personal_name: '', 
    establishment_name: '', 
    cnpj: '', 
    email: '', 
    ddi: '+55',
    whatsapp: '', 
    category_id: '', 
    tag_id: '', 
    active: true,
    internal_notes: ''
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Participants with Categories Join
    const { data: pData, error: pError } = await supabase
      .from('participants')
      .select(`
        *,
        category:categories!participants_category_id_fkey(name, color),
        tag:categories!participants_tag_id_fkey(name, color)
      `)
      .order('created_at', { ascending: false });
      
    if (!pError && pData) setParticipants(pData);

    // Fetch Categories for the Select inputs
    const { data: cData, error: cError } = await supabase.from('categories').select('*').order('name');
    if (!cError && cData) {
      setCategories({
        tipologias: cData.filter(c => c.type === 'tipologia'),
        tags: cData.filter(c => c.type === 'tag')
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (participant: any = null) => {
    if (participant) {
      let ddi = '+55';
      let phoneWithoutDdi = participant.whatsapp || '';
      if (phoneWithoutDdi.startsWith('+')) {
        const country = COUNTRIES.find(c => phoneWithoutDdi.startsWith(c.code));
        if (country) {
          ddi = country.code;
          phoneWithoutDdi = phoneWithoutDdi.substring(country.code.length);
        }
      }

      setFormData({
        ...defaultFormData,
        ...participant,
        ddi: ddi,
        whatsapp: formatPhone(phoneWithoutDdi),
        cnpj: formatCNPJ(participant.cnpj || ''),
        category_id: participant.category_id || '',
        tag_id: participant.tag_id || '',
        internal_notes: participant.internal_notes || ''
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
    
    if (!isValidCNPJ(formData.cnpj)) {
      alert('CNPJ inválido. Verifique os números digitados.');
      return;
    }

    const cleanCnpj = formData.cnpj.replace(/\D/g, '');
    const cleanPhone = formData.ddi + formData.whatsapp.replace(/\D/g, '');

    const dataToSave = {
      personal_name: formData.personal_name,
      establishment_name: formData.establishment_name,
      cnpj: cleanCnpj,
      email: formData.email,
      whatsapp: cleanPhone,
      category_id: formData.category_id || null,
      tag_id: formData.tag_id || null,
      active: formData.active,
      internal_notes: formData.internal_notes
    };

    if (isEditing) {
      await supabase.from('participants').update(dataToSave).eq('id', formData.id);
    } else {
      await supabase.from('participants').insert([dataToSave]);
    }
    
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar permanentemente este participante?')) {
      await supabase.from('participants').delete().eq('id', id);
      fetchData();
    }
  };

  const columns = [
    { 
      key: 'personal_name', 
      label: 'Nome', 
      render: (row: any) => <span style={{ fontWeight: 600 }}>{row.personal_name}</span>
    },
    { 
      key: 'establishment_name', 
      label: 'Empresa', 
      render: (row: any) => <span style={{ color: 'var(--text-muted)' }}>{row.establishment_name}</span>
    },
    { 
      key: 'cnpj', 
      label: 'CNPJ',
      render: (row: any) => {
        const c = row.cnpj || '';
        let displayCnpj = c;
        if (c.length === 14) {
          displayCnpj = c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{displayCnpj}</span>
            <button onClick={() => navigator.clipboard.writeText(c)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} title="Copiar CNPJ">
              <FiCopy size={14} />
            </button>
          </div>
        );
      }
    },
    { 
      key: 'contact', 
      label: 'Contatos', 
      render: (row: any) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a href={`https://wa.me/${row.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-color)', textDecoration: 'none' }}>
              <FaWhatsapp style={{ color: '#25D366', fontSize: '1.1rem' }} /> {row.whatsapp && !row.whatsapp.startsWith('+') ? `+55 ${row.whatsapp}` : row.whatsapp}
            </a>
            <button onClick={() => navigator.clipboard.writeText(row.whatsapp || '')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} title="Copiar WhatsApp">
              <FiCopy />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{row.email}</span>
            <button onClick={() => navigator.clipboard.writeText(row.email || '')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} title="Copiar E-mail">
              <FiCopy size={14} />
            </button>
          </div>
        </div>
      ) 
    },
    { 
      key: 'category', 
      label: 'Tipologia', 
      render: (row: any) => (
        row.category ? (
          <span className={styles.badge} style={{ backgroundColor: row.category.color + '20', color: row.category.color, border: `1px solid ${row.category.color}40` }}>
            {row.category.name}
          </span>
        ) : '-'
      )
    },
    { 
      key: 'tag', 
      label: 'Tag', 
      render: (row: any) => (
        row.tag ? (
          <span className={`${styles.badge} ${styles.tagBadge}`} style={{ color: row.tag.color, borderColor: row.tag.color }}>
            {row.tag.name}
          </span>
        ) : '-'
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
          <button className={styles.actionBtn} onClick={() => openModal(row)} title="Editar">
            <FiEdit />
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(row.id)} title="Apagar">
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
          <h1 className="adminPageTitle">Participantes</h1>
          <p className="adminPageDescription">Gerencie os inscritos no sorteio e gerencie as tags internas.</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <FiPlus /> Novo Participante
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <AdminTable columns={columns} data={participants} searchPlaceholder="Pesquisar por nome, empresa, cnpj ou email..." />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Editar Participante' : 'Novo Participante'} maxWidth="50%">
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome Pessoal</label>
              <input type="text" className="input-field" value={formData.personal_name} onChange={(e) => setFormData({...formData, personal_name: e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')})} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Estabelecimento</label>
              <input type="text" className="input-field" value={formData.establishment_name} onChange={(e) => setFormData({...formData, establishment_name: e.target.value})} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>CNPJ</label>
              <input type="text" className="input-field" value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})} maxLength={18} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>WhatsApp</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  className="input-field" 
                  style={{ width: '120px' }}
                  value={formData.ddi}
                  onChange={(e) => setFormData({...formData, ddi: e.target.value})}
                >
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <input 
                  type="tel" 
                  className="input-field" 
                  value={formData.whatsapp} 
                  onChange={(e) => setFormData({...formData, whatsapp: formatPhone(e.target.value)})} 
                  maxLength={15}
                  required 
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail</label>
              <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipologia (Pública)</label>
              <select className="input-field" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                <option value="">Selecione...</option>
                {categories.tipologias.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            {/* Campos Internos */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Tag (Uso Interno)</label>
              <select className="input-field" value={formData.tag_id} onChange={(e) => setFormData({...formData, tag_id: e.target.value})}>
                <option value="">Sem Tag</option>
                {categories.tags.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div className={styles.formGroup} style={{ justifyContent: 'center' }}>
              <label className={styles.checkboxContainer}>
                <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} />
                Participante Ativo no Sistema
              </label>
            </div>

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Observações (Uso Interno)</label>
              <textarea 
                className={`input-field ${styles.textarea}`} 
                value={formData.internal_notes}
                onChange={(e) => setFormData({...formData, internal_notes: e.target.value})}
                placeholder="Anotações visíveis apenas no painel administrativo..."
              ></textarea>
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
