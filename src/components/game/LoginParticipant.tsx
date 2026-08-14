"use client";

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { formatPhone } from '@/utils/formatters';
import { COUNTRIES } from '@/utils/countries';
import styles from '../home/OQueEsperar.module.css';

interface LoginParticipantProps {
  onSuccess: (participantId: string) => void;
  transparentForm?: boolean;
}

export default function LoginParticipant({ onSuccess, transparentForm = false }: LoginParticipantProps) {
  const [formData, setFormData] = useState({
    email: '',
    ddi: '+55',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, whatsapp: formatPhone(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email.trim() || !formData.whatsapp.trim()) {
      setError('Por favor, preencha o E-mail e o WhatsApp.');
      setLoading(false);
      return;
    }

    const normalizedEmail = formData.email.trim().toLowerCase();
    const cleanPhone = formData.ddi + formData.whatsapp.replace(/\D/g, '');

    const { data, error: queryError } = await supabase
      .from('participants')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('whatsapp', cleanPhone)
      .maybeSingle();

    if (queryError) {
      console.error(queryError);
      setError('Erro ao verificar inscrição. Tente novamente.');
      setLoading(false);
      return;
    }

    if (data && data.id) {
      onSuccess(data.id);
    } else {
      setError('Participante não encontrado. Verifique se o E-mail e o WhatsApp estão corretos ou faça sua inscrição.');
    }

    setLoading(false);
  };

  return (
    <form className={styles.formContainer} style={transparentForm ? { background: 'transparent', border: 'none', padding: '0', boxShadow: 'none' } : {}} onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Já sou inscrito</h3>
        <p style={{ color: '#a0a0a0', fontSize: '0.9rem', lineHeight: '1.4' }}>
          Informe seu E-mail e WhatsApp usados no cadastro para acessar o jogo.
        </p>
      </div>

      <div>
        <input 
          type="email" 
          placeholder="E-mail cadastrado *" 
          className="input-field" 
          required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      <div>
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
            placeholder="WhatsApp (com DDD) *" 
            className="input-field" 
            style={{ flex: 1 }}
            required 
            value={formData.whatsapp}
            onChange={handlePhoneChange}
            maxLength={15}
          />
        </div>
      </div>

      {error && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0' }}>{error}</p>}

      <button type="submit" className="btn-primary" disabled={loading} style={{ margin: 0, marginTop: '0.5rem' }}>
        {loading ? 'Verificando...' : 'Acessar Jogo'}
      </button>
    </form>
  );
}
