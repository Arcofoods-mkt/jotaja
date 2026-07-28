"use client";

import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiPlayCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import { createClient } from '@/utils/supabase/client';
import { usePermissions } from '@/contexts/PermissionsContext';
import styles from './Sorteios.module.css';

export default function SorteiosPage() {
  const [draws, setDraws] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [tipologias, setTipologias] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [drawName, setDrawName] = useState('');
  const [selectedTipologia, setSelectedTipologia] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const router = useRouter();
  const supabase = createClient();
  const { permissions, isAdmin } = usePermissions();
  const perms = isAdmin ? { ver: true, editar: true, bloquear: true, excluir: true } : (permissions.Sorteios || {});

  const fetchData = async () => {
    setLoading(true);
    // Fetch Draws
    const { data: dData } = await supabase.from('draws').select('*').order('created_at', { ascending: false });
    if (dData) setDraws(dData);

    // Fetch Participants
    const { data: pData } = await supabase.from('participants').select('id, personal_name, establishment_name, category_id, tag_id, active').eq('active', true);
    if (pData) setParticipants(pData);

    // Fetch Categories & Tags
    const { data: cData } = await supabase.from('categories').select('*').order('name');
    if (cData) {
      setTipologias(cData.filter(c => c.type !== 'tag'));
      setTags(cData.filter(c => c.type === 'tag'));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter participants based on selected tipologia and tag
  const filteredParticipants = participants.filter(p => {
    let matchTipologia = true;
    let matchTag = true;

    if (selectedTipologia) {
      matchTipologia = p.category_id === selectedTipologia;
    }
    if (selectedTag) {
      matchTag = p.tag_id === selectedTag;
    }

    return matchTipologia && matchTag;
  });

  const handleSelectAll = () => {
    const allIds = filteredParticipants.map(p => p.id);
    setSelectedParticipants(allIds);
  };

  const handleClearSelection = () => {
    setSelectedParticipants([]);
  };

  const handleToggleParticipant = (id: string) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(prev => prev.filter(pid => pid !== id));
    } else {
      setSelectedParticipants(prev => [...prev, id]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedParticipants.length === 0) {
      alert("Selecione pelo menos um participante para o sorteio.");
      return;
    }

    try {
      // 1. Create Draw
      const { data: newDraw, error: drawError } = await supabase
        .from('draws')
        .insert([{ name: drawName }])
        .select()
        .single();

      if (drawError) throw drawError;

      // 2. Link Participants
      const participantLinks = selectedParticipants.map(pid => ({
        draw_id: newDraw.id,
        participant_id: pid
      }));

      const { error: linkError } = await supabase.from('draw_participants').insert(participantLinks);
      if (linkError) throw linkError;

      setIsModalOpen(false);
      setDrawName('');
      setSelectedParticipants([]);
      setSelectedTipologia('');
      setSelectedTag('');
      fetchData();
      
    } catch (err: any) {
      console.error(err);
      alert("Erro ao criar sorteio: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar permanentemente este sorteio? Todo o histórico de vencedores dele será perdido!')) {
      await supabase.from('draws').delete().eq('id', id);
      fetchData();
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Nome do Evento', 
      render: (row: any) => <span style={{ fontWeight: 600 }}>{row.name}</span>
    },
    { 
      key: 'created_at', 
      label: 'Data de Criação', 
      render: (row: any) => new Date(row.created_at).toLocaleDateString('pt-BR')
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (row: any) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`${styles.actionBtn} ${styles.playBtn}`} 
            onClick={() => router.push(`/painel-administrador/sorteios/${row.id}`)}
            title="Abrir Roleta de Sorteio"
          >
            <FiPlayCircle />
          </button>
          
          {perms.excluir !== false && (
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(row.id)} title="Apagar Sorteio">
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
          <h1 className="adminPageTitle">Sorteios</h1>
          <p className="adminPageDescription">Crie grupos e realize sorteios sem repetição de vencedores.</p>
        </div>
        {perms.editar !== false && (
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <FiPlus /> Novo Sorteio
          </button>
        )}
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : perms.ver === false ? (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <p>Você não tem permissão para visualizar estas informações.</p>
        </div>
      ) : (
        <AdminTable columns={columns} data={draws} searchPlaceholder="Pesquisar sorteios..." />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Novo Sorteio" maxWidth="60%">
        <form className={styles.form} onSubmit={handleSave}>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Nome do Sorteio / Evento</label>
            <input 
              type="text" 
              className="input-field" 
              value={drawName} 
              onChange={(e) => setDrawName(e.target.value)} 
              required 
              placeholder="Ex: Sorteio de Natal - Açougues"
            />
          </div>

          <hr style={{ borderColor: 'var(--admin-border)', margin: '1rem 0' }} />

          <div className={styles.filterHeader}>
            <div style={{ display: 'flex', gap: '1rem', flex: 1, marginRight: '1rem' }}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Filtrar por Tipologia</label>
                <select 
                  className="input-field" 
                  value={selectedTipologia} 
                  onChange={(e) => setSelectedTipologia(e.target.value)}
                >
                  <option value="">Todas as Tipologias</option>
                  {tipologias.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Filtrar por Tag</label>
                <select 
                  className="input-field" 
                  value={selectedTag} 
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <option value="">Todas as Tags</option>
                  {tags.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={handleSelectAll} style={{ background: 'var(--accent-color)', border: '1px solid var(--accent-color)', color: '#000', padding: '0.8rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Selecionar Todos
              </button>
              <button type="button" onClick={handleClearSelection} style={{ background: 'transparent', border: '1px solid var(--admin-border)', color: 'var(--text-color)', padding: '0.8rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Limpar
              </button>
            </div>
          </div>

          <div className={styles.participantsList}>
            {filteredParticipants.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum participante encontrado neste filtro.</div>
            ) : (
              filteredParticipants.map(p => (
                <label key={p.id} className={styles.participantRow}>
                  <input 
                    type="checkbox" 
                    className={styles.checkbox}
                    checked={selectedParticipants.includes(p.id)}
                    onChange={() => handleToggleParticipant(p.id)}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-color)' }}>{p.personal_name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.establishment_name}</span>
                  </div>
                </label>
              ))
            )}
          </div>
          
          <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', textAlign: 'right' }}>
            {selectedParticipants.length} participante(s) selecionado(s) para o sorteio.
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-danger" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar Sorteio</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
