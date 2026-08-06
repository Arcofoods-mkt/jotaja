"use client";

import React, { useState, useEffect } from 'react';
import { FiSave, FiImage, FiX, FiSettings, FiAward } from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import { usePermissions } from '@/contexts/PermissionsContext';
import RankingComponent from '@/components/admin/RankingComponent';
import styles from './JogoMemoria.module.css';
import { logAction } from '@/utils/logger';

export default function JogoMemoriaPage() {
  const [activeTab, setActiveTab] = useState<'config' | 'ranking'>('config');
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [gridWidth, setGridWidth] = useState(4);
  const [gridHeight, setGridHeight] = useState(4);
  const [timeLimit, setTimeLimit] = useState(60);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();
  const { permissions, isAdmin } = usePermissions();
  const perms = isAdmin ? { ver: true, editar: true } : (permissions.Sorteios || {});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('memory_game_settings')
      .select('*')
      .eq('active', true)
      .limit(1)
      .maybeSingle();

    if (data) {
      setSettingsId(data.id);
      setGridWidth(data.grid_width);
      setGridHeight(data.grid_height);
      setTimeLimit(data.time_limit_seconds);
      setImages(data.images || []);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const requiredPairs = (gridWidth * gridHeight) / 2;
      if (images.length < requiredPairs) {
        alert(`Para uma grade de ${gridWidth}x${gridHeight}, você precisa de pelo menos ${requiredPairs} imagens diferentes.`);
        setSaving(false);
        return;
      }

      const payload = {
        grid_width: gridWidth,
        grid_height: gridHeight,
        time_limit_seconds: timeLimit,
        images: images,
        active: true
      };

      if (settingsId) {
        await supabase.from('memory_game_settings').update(payload).eq('id', settingsId);
        await logAction({ action: 'Editar', entity: 'JogoMemoria', entity_id: settingsId, description: 'Atualizou configurações do jogo da memória' });
      } else {
        const { data } = await supabase.from('memory_game_settings').insert([payload]).select().single();
        if (data) setSettingsId(data.id);
        await logAction({ action: 'Criar', entity: 'JogoMemoria', entity_id: data?.id, description: 'Criou configurações iniciais do jogo da memória' });
      }
      alert('Configurações salvas com sucesso!');
    } catch (err: any) {
      console.error(err);
      alert('Erro ao salvar configurações: ' + err.message);
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    
    const file = e.target.files[0];

    const checkImageDimensions = (): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          resolve(img.width === img.height);
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          resolve(false);
        };
        img.src = URL.createObjectURL(file);
      });
    };

    const isSquare = await checkImageDimensions();
    if (!isSquare) {
      alert('Por favor, envie apenas imagens quadradas (proporção 1:1, exemplo: 500x500).');
      setUploading(false);
      e.target.value = '';
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('game-images')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error("O bucket 'game-images' não foi encontrado no Supabase Storage. Crie o bucket público antes de enviar imagens.");
        }
        throw uploadError;
      }

      const { data } = supabase.storage.from('game-images').getPublicUrl(filePath);
      if (data) {
        setImages((prev) => [...prev, data.publicUrl]);
      }
    } catch (error: any) {
      alert('Erro ao fazer upload da imagem: ' + error.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return <div style={{ padding: '2rem' }}>Carregando configurações...</div>;

  if (perms.ver === false) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
        <p>Você não tem permissão para visualizar estas informações.</p>
      </div>
    );
  }

  const totalCards = gridWidth * gridHeight;
  const pairsNeeded = totalCards / 2;
  const isOdd = totalCards % 2 !== 0;

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1 className="adminPageTitle">Jogo da Memória</h1>
          <p className="adminPageDescription">Gerencie o jogo da memória e o ranking dos participantes.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--admin-border)' }}>
        <button 
          onClick={() => setActiveTab('config')}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '1rem', 
            color: activeTab === 'config' ? 'var(--accent-color)' : 'var(--text-muted)',
            borderBottom: activeTab === 'config' ? '2px solid var(--accent-color)' : '2px solid transparent',
            fontWeight: activeTab === 'config' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem'
          }}
        >
          <FiSettings /> Configurações
        </button>
        <button 
          onClick={() => setActiveTab('ranking')}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '1rem', 
            color: activeTab === 'ranking' ? 'var(--accent-color)' : 'var(--text-muted)',
            borderBottom: activeTab === 'ranking' ? '2px solid var(--accent-color)' : '2px solid transparent',
            fontWeight: activeTab === 'ranking' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem'
          }}
        >
          <FiAward /> Ranking e Prêmios
        </button>
      </div>

      {activeTab === 'config' ? (
      <div style={{ background: 'var(--admin-card)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
        <form onSubmit={handleSave}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Largura da Grade (X)</label>
              <input 
                type="number" 
                className="input-field" 
                value={gridWidth} 
                onChange={(e) => setGridWidth(Number(e.target.value))}
                min={2}
                max={10}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Altura da Grade (Y)</label>
              <input 
                type="number" 
                className="input-field" 
                value={gridHeight} 
                onChange={(e) => setGridHeight(Number(e.target.value))}
                min={2}
                max={10}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tempo Limite (segundos)</label>
              <input 
                type="number" 
                className="input-field" 
                value={timeLimit} 
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                min={10}
                required
              />
              <p className={styles.helpText}>Tempo que o jogador tem para completar o jogo.</p>
            </div>
          </div>

          {isOdd && (
            <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
              Atenção: A multiplicação de largura por altura ({gridWidth}x{gridHeight}={totalCards}) deve resultar em um número par de cartas.
            </div>
          )}

          <hr style={{ borderColor: 'var(--admin-border)', margin: '2rem 0' }} />

          <div className={styles.formGroup}>
            <label className={styles.label}>Imagens das Cartas</label>
            <p className={styles.helpText}>
              Para uma grade de {gridWidth}x{gridHeight}, você precisa de <strong>{pairsNeeded} pares</strong>. 
              Portanto, faça o upload de pelo menos {pairsNeeded} imagens diferentes. 
              (Você tem {images.length} imagens atualmente).
            </p>

            <div className={styles.imagesContainer}>
              {images.map((url, idx) => (
                <div key={idx} className={styles.imageBox}>
                  <button type="button" className={styles.deleteBtn} onClick={() => removeImage(idx)} title="Remover Imagem">
                    <FiX />
                  </button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Carta ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              
              <label className={styles.addImageBtn} title="Adicionar Imagem">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                  disabled={uploading || isOdd}
                />
                {uploading ? <span style={{ fontSize: '1rem' }}>...</span> : <FiImage />}
              </label>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={saving || isOdd || images.length < pairsNeeded}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FiSave /> {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
      ) : (
        <RankingComponent />
      )}
    </div>
  );
}
