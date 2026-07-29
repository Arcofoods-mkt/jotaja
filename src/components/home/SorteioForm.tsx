"use client";

import React, { useState } from 'react';
import CustomSelect from '../CustomSelect';
import { createClient } from '@/utils/supabase/client';
import styles from './OQueEsperar.module.css';
import { COUNTRIES } from '@/utils/countries';
import { isValidCNPJ, formatCNPJ, formatPhone } from '@/utils/formatters';

interface Option {
  value: string;
  label: string;
}

interface SorteioFormProps {
  tipologiaOptions: Option[];
}

export default function SorteioForm({ tipologiaOptions }: SorteioFormProps) {
  const [formData, setFormData] = useState({
    personal_name: '',
    establishment_name: '',
    cnpj: '',
    email: '',
    ddi: '+55',
    whatsapp: '',
    category_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({ cnpj: '', email: '', whatsapp: '', general: '' });

  const supabase = createClient();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Apenas letras, espaços e acentos
    const val = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    setFormData({...formData, personal_name: val});
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, cnpj: formatCNPJ(e.target.value)});
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, whatsapp: formatPhone(e.target.value)});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ cnpj: '', email: '', whatsapp: '', general: '' });
    setSuccess(false);

    if (!formData.category_id) {
      setErrors(prev => ({ ...prev, general: 'Por favor, selecione uma tipologia.' }));
      setLoading(false);
      return;
    }

    if (!isValidCNPJ(formData.cnpj)) {
      setErrors(prev => ({ ...prev, cnpj: 'CNPJ inválido. Verifique os números digitados.' }));
      setLoading(false);
      return;
    }

    // Limpar o CNPJ antes de enviar pro banco
    const cleanCnpj = formData.cnpj.replace(/\D/g, '');
    const cleanPhone = formData.ddi + formData.whatsapp.replace(/\D/g, '');

    // Verificar duplicidade de CNPJ, email e whatsapp antes de inserir
    const { data: existingCnpj } = await supabase.from('participants').select('id').eq('cnpj', cleanCnpj).maybeSingle();
    if (existingCnpj) {
      setErrors(prev => ({ ...prev, cnpj: 'Esse CNPJ já está participando do sorteio' }));
      setLoading(false);
      return;
    }

    const { data: existingEmail } = await supabase.from('participants').select('id').eq('email', formData.email.trim()).maybeSingle();
    if (existingEmail) {
      setErrors(prev => ({ ...prev, email: 'Este e-mail já foi cadastrado no sorteio.' }));
      setLoading(false);
      return;
    }

    const { data: existingPhone } = await supabase.from('participants').select('id').eq('whatsapp', cleanPhone).maybeSingle();
    if (existingPhone) {
      setErrors(prev => ({ ...prev, whatsapp: 'Este telefone já foi cadastrado no sorteio.' }));
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('participants').insert([{
      personal_name: formData.personal_name.trim(),
      establishment_name: formData.establishment_name.trim(),
      cnpj: cleanCnpj,
      email: formData.email.trim(),
      whatsapp: cleanPhone,
      category_id: formData.category_id
    }]);

    if (insertError) {
      console.error(insertError);
      setErrors(prev => ({ ...prev, general: 'Ocorreu um erro ao enviar sua inscrição. Verifique os dados e tente novamente.' }));
    } else {
      setSuccess(true);
      setFormData({
        personal_name: '',
        establishment_name: '',
        cnpj: '',
        email: '',
        ddi: '+55',
        whatsapp: '',
        category_id: ''
      });
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--accent-color)' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Inscrição Realizada! 🎉</h3>
        <p style={{ color: 'var(--text-color)' }}>Seus dados foram enviados com sucesso para o sorteio da Arcofoods no Jotajá Summit.</p>
        <button type="button" className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSuccess(false)}>
          Fazer nova inscrição
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      <input 
        type="text" 
        placeholder="Nome Pessoal" 
        className="input-field" 
        required 
        value={formData.personal_name}
        onChange={handleNameChange}
      />
      <input 
        type="text" 
        placeholder="Nome do Estabelecimento" 
        className="input-field" 
        required 
        value={formData.establishment_name}
        onChange={(e) => setFormData({...formData, establishment_name: e.target.value})}
      />
      <input 
        type="text" 
        placeholder="CNPJ" 
        className="input-field" 
        required 
        value={formData.cnpj}
        onChange={handleCnpjChange}
        maxLength={18}
        style={errors.cnpj ? { borderColor: '#ff4d4f', marginBottom: '0.2rem' } : {}}
      />
      {errors.cnpj && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', marginBottom: '1rem', marginTop: 0 }}>{errors.cnpj}</p>}
      
      <input 
        type="email" 
        placeholder="E-mail" 
        className="input-field" 
        required 
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        style={errors.email ? { borderColor: '#ff4d4f', marginBottom: '0.2rem' } : {}}
      />
      {errors.email && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', marginBottom: '1rem', marginTop: 0 }}>{errors.email}</p>}
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        <select 
          className="input-field" 
          style={{ width: '120px', marginBottom: 0 }}
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
          placeholder="WhatsApp (com DDD)" 
          className="input-field" 
          style={{ marginBottom: 0, flex: 1, ...(errors.whatsapp ? { borderColor: '#ff4d4f' } : {}) }}
          required 
          value={formData.whatsapp}
          onChange={handlePhoneChange}
          maxLength={15}
        />
      </div>
      {errors.whatsapp && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', marginBottom: '1rem', marginTop: '-0.8rem' }}>{errors.whatsapp}</p>}

      <CustomSelect 
        placeholder="Selecione a Tipologia"
        options={tipologiaOptions.length > 0 ? tipologiaOptions : [{ value: '', label: 'Nenhuma tipologia cadastrada' }]}
        value={formData.category_id}
        onChange={(val) => setFormData({...formData, category_id: val})}
      />

      {errors.general && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', marginTop: '0.5rem' }}>{errors.general}</p>}

      <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
        {loading ? 'Enviando...' : 'Participar agora!'}
      </button>
    </form>
  );
}
