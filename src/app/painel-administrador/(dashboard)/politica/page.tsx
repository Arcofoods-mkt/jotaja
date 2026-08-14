"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { usePermissions } from '@/contexts/PermissionsContext';
import { logAction } from '@/utils/logger';

export default function PoliticaPage() {
  const [termsText, setTermsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();
  
  const { permissions, isAdmin } = usePermissions();
  const canEdit = isAdmin || permissions.Configuracoes?.editar;

  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'terms_of_use')
        .single();
      
      if (data && !error) {
        setTermsText(data.value || '');
      }
      setLoading(false);
    };

    fetchTerms();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    
    // UPSERT operation (insert or update)
    const { error } = await supabase
      .from('system_settings')
      .upsert({ 
        key: 'terms_of_use', 
        value: termsText,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      alert('Erro ao salvar os termos de uso: ' + error.message);
    } else {
      await logAction({ action: 'Editar', entity: 'Configurações', description: 'Atualizou os Termos de Uso e Política de Privacidade' });
      alert('Termos salvos com sucesso!');
    }
    setSaving(false);
  };

  const insertTag = (openTag: string, closeTag: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end, text.length);

    const newText = `${before}${openTag}${selected}${closeTag}${after}`;
    setTermsText(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, end + openTag.length);
    }, 0);
  };

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1 className="adminPageTitle">Política e Termos</h1>
          <p className="adminPageDescription">Gerencie os Termos de Uso e a Política de Privacidade do evento.</p>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => insertTag('<b>', '</b>')}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  B
                </button>
                <button 
                  type="button" 
                  onClick={() => insertTag('<i>', '</i>')}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', color: '#fff', cursor: 'pointer', fontStyle: 'italic' }}
                >
                  I
                </button>
              </div>
              <textarea
                ref={textareaRef}
                id="termsText"
                className="input-field"
                style={{ minHeight: '400px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }}
                value={termsText}
                onChange={(e) => setTermsText(e.target.value)}
                placeholder="Cole ou digite aqui os Termos de Uso e a Política de Privacidade do seu evento..."
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ width: 'auto', minWidth: '150px' }} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Política'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
