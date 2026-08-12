"use client";

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiCopy, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import MultiSelect from '@/components/admin/MultiSelect';
import { createClient } from '@/utils/supabase/client';
import { usePermissions } from '@/contexts/PermissionsContext';
import styles from './Participantes.module.css';
import { COUNTRIES } from '@/utils/countries';
import { isValidCNPJ, formatCNPJ, formatPhone } from '@/utils/formatters';
import { logAction } from '@/utils/logger';

export default function ParticipantesPage() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [categories, setCategories] = useState<{tipologias: any[], tags: any[], eventos: any[], segmentos: any[], classificacoes: any[]}>({tipologias: [], tags: [], eventos: [], segmentos: [], classificacoes: []});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Advanced Filter State
  const [selectedFilters, setSelectedFilters] = useState<{tipologias: string[], tags: string[], eventos: string[], segmentos: string[], classificacoes: string[]}>({
    tipologias: [], tags: [], eventos: [], segmentos: [], classificacoes: []
  });
  const [draftFilters, setDraftFilters] = useState<{tipologias: string[], tags: string[], eventos: string[], segmentos: string[], classificacoes: string[]}>({
    tipologias: [], tags: [], eventos: [], segmentos: [], classificacoes: []
  });

  const toggleFilter = (type: keyof typeof selectedFilters, id: string) => {
    setSelectedFilters(prev => {
      const current = prev[type];
      const updated = current.includes(id) ? current.filter(itemId => itemId !== id) : [...current, id];
      return { ...prev, [type]: updated };
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0);
  };
  
  const clearFilters = () => {
    const empty = {tipologias: [], tags: [], eventos: [], segmentos: [], classificacoes: []};
    setSelectedFilters(empty);
    setDraftFilters(empty);
    setIsFilterModalOpen(false);
  };
  
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
    event_id: '',
    segment_id: '',
    classification_id: '',
    active: true,
    internal_notes: ''
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({ personal_name: '', establishment_name: '', cnpj: '', email: '', whatsapp: '', general: '' });
  const [successMessage, setSuccessMessage] = useState('');

  // Permissions
  const { permissions, isAdmin } = usePermissions();
  const perms = isAdmin ? { ver: true, editar: true, bloquear: true, excluir: true } : (permissions.Participantes || {});

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Participants with Categories Join
    const { data: pData, error: pError } = await supabase
      .from('participants')
      .select(`
        *,
        category:categories!participants_category_id_fkey(name, color),
        tag:categories!participants_tag_id_fkey(name, color),
        event:categories!participants_event_id_fkey(name, color),
        segment:categories!participants_segment_id_fkey(name, color),
        classification:categories!participants_classification_id_fkey(name, color)
      `)
      .order('created_at', { ascending: false });
      
    if (!pError && pData) setParticipants(pData);

    // Fetch Categories for the Select inputs
    const { data: cData, error: cError } = await supabase.from('categories').select('*').order('name');
    if (!cError && cData) {
      setCategories({
        tipologias: cData.filter(c => c.type === 'tipologia'),
        tags: cData.filter(c => c.type === 'tag'),
        eventos: cData.filter(c => c.type === 'evento'),
        segmentos: cData.filter(c => c.type === 'segmento'),
        classificacoes: cData.filter(c => c.type === 'classificacao')
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
        event_id: participant.event_id || '',
        segment_id: participant.segment_id || '',
        classification_id: participant.classification_id || '',
        internal_notes: participant.internal_notes || ''
      });
      setIsEditing(true);
    } else {
      setFormData(defaultFormData);
      setIsEditing(false);
    }
    setErrors({ personal_name: '', establishment_name: '', cnpj: '', email: '', whatsapp: '', general: '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ personal_name: '', establishment_name: '', cnpj: '', email: '', whatsapp: '', general: '' });
    
    let hasErrors = false;
    const newErrors = { personal_name: '', establishment_name: '', cnpj: '', email: '', whatsapp: '', general: '' };

    if (!formData.personal_name.trim()) { newErrors.personal_name = 'Obrigatório'; hasErrors = true; }
    if (!formData.establishment_name.trim()) { newErrors.establishment_name = 'Obrigatório'; hasErrors = true; }
    if (!formData.email.trim()) { newErrors.email = 'Obrigatório'; hasErrors = true; }
    if (!formData.whatsapp.trim()) { newErrors.whatsapp = 'Obrigatório'; hasErrors = true; }
    
    if (formData.cnpj && !isValidCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido.';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const cleanCnpj = formData.cnpj.replace(/\D/g, '');
    const cleanPhone = formData.ddi + formData.whatsapp.replace(/\D/g, '');
    const normalizedEmail = formData.email.trim().toLowerCase();

    const dataToSave = {
      personal_name: formData.personal_name,
      establishment_name: formData.establishment_name,
      cnpj: cleanCnpj,
      email: normalizedEmail,
      whatsapp: cleanPhone,
      category_id: formData.category_id || null,
      tag_id: formData.tag_id || null,
      event_id: formData.event_id || null,
      segment_id: formData.segment_id || null,
      classification_id: formData.classification_id || null,
      active: formData.active,
      internal_notes: formData.internal_notes
    };

    let savedId = formData.id;
    let insertOrUpdateError = null;

    if (isEditing) {
      const { error } = await supabase.from('participants').update(dataToSave).eq('id', formData.id);
      insertOrUpdateError = error;
      if (!error) await logAction({ action: 'Editar', entity: 'Leads', entity_id: savedId, description: `Editou o lead ${formData.personal_name}` });
    } else {
      const { data, error } = await supabase.from('participants').insert([dataToSave]).select('id');
      insertOrUpdateError = error;
      if (data && data.length > 0) savedId = data[0].id;
      if (!error) await logAction({ action: 'Criar', entity: 'Leads', entity_id: savedId || undefined, description: `Criou o lead ${formData.personal_name}` });
    }
    
    if (insertOrUpdateError) {
      const errMsg = insertOrUpdateError.message || '';
      if (errMsg.includes('participants_email_key') || errMsg.includes('duplicate key value') && errMsg.includes('email')) {
        setErrors(prev => ({ ...prev, email: 'Este e-mail já foi cadastrado no sistema.' }));
      } else if (errMsg.includes('participants_whatsapp_key') || errMsg.includes('duplicate key value') && errMsg.includes('whatsapp')) {
        setErrors(prev => ({ ...prev, whatsapp: 'Este telefone já foi cadastrado no sistema.' }));
      } else {
        setErrors(prev => ({ ...prev, general: `Erro ao salvar: ${errMsg}` }));
      }
      return;
    }
    
    setIsModalOpen(false);
    fetchData();
    setSuccessMessage(isEditing ? 'Lead atualizado com sucesso!' : 'Lead cadastrado com sucesso!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm('Tem certeza que deseja apagar permanentemente este participante?')) {
      await supabase.from('participants').delete().eq('id', row.id);
      await logAction({ action: 'Apagar', entity: 'Leads', entity_id: row.id, description: `Apagou o lead ${row.personal_name}` });
      fetchData();
    }
  };

  const filteredParticipants = participants.filter(p => {
    const matchTipologia = selectedFilters.tipologias.length === 0 || selectedFilters.tipologias.includes(p.category_id);
    const matchTag = selectedFilters.tags.length === 0 || selectedFilters.tags.includes(p.tag_id);
    const matchEvento = selectedFilters.eventos.length === 0 || selectedFilters.eventos.includes(p.event_id);
    const matchSegmento = selectedFilters.segmentos.length === 0 || selectedFilters.segmentos.includes(p.segment_id);
    const matchClassificacao = selectedFilters.classificacoes.length === 0 || selectedFilters.classificacoes.includes(p.classification_id);

    return matchTipologia && matchTag && matchEvento && matchSegmento && matchClassificacao;
  });

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
      key: 'event', 
      label: 'Evento', 
      render: (row: any) => (
        row.event ? (
          <span className={styles.badge} style={{ backgroundColor: row.event.color + '20', color: row.event.color, border: `1px solid ${row.event.color}40` }}>
            {row.event.name}
          </span>
        ) : '-'
      )
    },
    { 
      key: 'segment', 
      label: 'Segmento', 
      render: (row: any) => (
        row.segment ? (
          <span className={styles.badge} style={{ backgroundColor: row.segment.color + '20', color: row.segment.color, border: `1px solid ${row.segment.color}40` }}>
            {row.segment.name}
          </span>
        ) : '-'
      )
    },
    { 
      key: 'classification', 
      label: 'Classificação', 
      render: (row: any) => (
        row.classification ? (
          <span className={`${styles.badge} ${styles.tagBadge}`} style={{ color: row.classification.color, borderColor: row.classification.color }}>
            {row.classification.name}
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
          {perms.editar !== false && (
            <button className={styles.actionBtn} onClick={() => openModal(row)} title="Editar">
              <FiEdit />
            </button>
          )}
          {perms.excluir !== false && (
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(row)} title="Apagar">
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
          <h1 className="adminPageTitle">Leads</h1>
          <p className="adminPageDescription">Gerencie os leads inscritos e as tags internas.</p>
        </div>
        <div className={styles.headerActions}>
          {perms.editar !== false && (
            <button className={styles.addBtn} onClick={() => openModal()}>
              <FiPlus /> Novo Lead
            </button>
          )}
          <div className={styles.mobileViewToggles}>
            <button className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`} onClick={() => setViewMode('list')}><FiList /></button>
            <button className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.active : ''}`} onClick={() => setViewMode('grid')}><FiGrid /></button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(37, 211, 102, 0.1)', border: '1px solid #25D366', color: '#25D366', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          {successMessage}
        </div>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : perms.ver === false ? (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <p>Você não tem permissão para visualizar estas informações.</p>
        </div>
      ) : (
        <AdminTable 
          columns={columns} 
          data={filteredParticipants} 
          searchFields={['personal_name', 'establishment_name', 'cnpj', 'email', 'whatsapp']}
          searchPlaceholder="Pesquisar por nome, empresa, cnpj, email ou whatsapp..." 
          viewMode={viewMode}
          extraHeaderContent={
            <button 
              className={`${styles.filterBtn} ${getActiveFilterCount() > 0 ? styles.filterBtnActive : ''}`} 
              onClick={() => {
                setDraftFilters(selectedFilters);
                setIsFilterModalOpen(true);
              }}
            >
              <FiFilter /> Filtros
              {getActiveFilterCount() > 0 && <span className={styles.filterBadge}>{getActiveFilterCount()}</span>}
            </button>
          }
        />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Editar Lead' : 'Novo Lead'}>
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome Pessoal *</label>
              <input type="text" className="input-field" value={formData.personal_name} onChange={(e) => setFormData({...formData, personal_name: e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')})} style={errors.personal_name ? { borderColor: '#ff4d4f' } : {}} required />
              {errors.personal_name && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0' }}>{errors.personal_name}</p>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Estabelecimento *</label>
              <input type="text" className="input-field" value={formData.establishment_name} onChange={(e) => setFormData({...formData, establishment_name: e.target.value})} style={errors.establishment_name ? { borderColor: '#ff4d4f' } : {}} required />
              {errors.establishment_name && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0' }}>{errors.establishment_name}</p>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>CNPJ *</label>
              <input type="text" className="input-field" value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})} style={errors.cnpj ? { borderColor: '#ff4d4f' } : {}} required />
              {errors.cnpj && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0' }}>{errors.cnpj}</p>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>WhatsApp *</label>
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
                  style={errors.whatsapp ? { borderColor: '#ff4d4f' } : {}}
                  maxLength={15}
                  required 
                />
              </div>
              {errors.whatsapp && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0' }}>{errors.whatsapp}</p>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail *</label>
              <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={errors.email ? { borderColor: '#ff4d4f' } : {}} required />
              {errors.email && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0' }}>{errors.email}</p>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipologia (Pública)</label>
              <select className="input-field" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                <option value="">Selecione...</option>
                {categories.tipologias.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Segmento</label>
              <select className="input-field" value={formData.segment_id} onChange={(e) => setFormData({...formData, segment_id: e.target.value})}>
                <option value="">Sem Segmento</option>
                {categories.segmentos.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            {/* Campos Internos */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Classificação (Interno)</label>
              <select className="input-field" value={formData.classification_id} onChange={(e) => setFormData({...formData, classification_id: e.target.value})}>
                <option value="">Sem Classificação</option>
                {categories.classificacoes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tag (Uso Interno)</label>
              <select className="input-field" value={formData.tag_id} onChange={(e) => setFormData({...formData, tag_id: e.target.value})}>
                <option value="">Sem Tag</option>
                {categories.tags.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Evento Origem</label>
              <select className="input-field" value={formData.event_id} onChange={(e) => setFormData({...formData, event_id: e.target.value})}>
                <option value="">Sem Evento (Direto)</option>
                {categories.eventos.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div className={styles.formGroup} style={{ justifyContent: 'center' }}>
              <label className={styles.checkboxContainer} style={{ opacity: perms.bloquear === false ? 0.5 : 1 }}>
                <input 
                  type="checkbox" 
                  checked={formData.active} 
                  onChange={(e) => setFormData({...formData, active: e.target.checked})} 
                  disabled={perms.bloquear === false}
                />
                Lead Ativo no Sistema
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

          {errors.general && (
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 77, 79, 0.1)', border: '1px solid #ff4d4f', color: '#ff4d4f', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
              {errors.general}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-danger" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </AdminModal>
      <AdminModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Filtros Avançados">
        <div>
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Tipologias (Público)</div>
            <MultiSelect 
              options={categories.tipologias}
              selectedIds={draftFilters.tipologias}
              onChange={(ids) => setDraftFilters({...draftFilters, tipologias: ids})}
              placeholder="Buscar tipologia..."
            />
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Eventos</div>
            <MultiSelect 
              options={categories.eventos}
              selectedIds={draftFilters.eventos}
              onChange={(ids) => setDraftFilters({...draftFilters, eventos: ids})}
              placeholder="Buscar evento..."
            />
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Tags (Interno)</div>
            <MultiSelect 
              options={categories.tags}
              selectedIds={draftFilters.tags}
              onChange={(ids) => setDraftFilters({...draftFilters, tags: ids})}
              placeholder="Buscar tag..."
            />
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Segmentos</div>
            <MultiSelect 
              options={categories.segmentos}
              selectedIds={draftFilters.segmentos}
              onChange={(ids) => setDraftFilters({...draftFilters, segmentos: ids})}
              placeholder="Buscar segmento..."
            />
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Classificação (Interno)</div>
            <MultiSelect 
              options={categories.classificacoes}
              selectedIds={draftFilters.classificacoes}
              onChange={(ids) => setDraftFilters({...draftFilters, classificacoes: ids})}
              placeholder="Buscar classificação..."
            />
          </div>

          <div className="modal-actions" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn-danger" onClick={clearFilters} disabled={getActiveFilterCount() === 0 && Object.values(draftFilters).every(v => v.length === 0)}>Limpar Filtros</button>
            <button type="button" className="btn-primary" onClick={() => {
              setSelectedFilters(draftFilters);
              setIsFilterModalOpen(false);
            }}>Aplicar Filtros</button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
