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
  eventId?: string;
  onSuccess?: (participantData: any) => void;
}

export default function SorteioForm({ tipologiaOptions, eventId, onSuccess }: SorteioFormProps) {
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
  const [errors, setErrors] = useState({ personal_name: '', establishment_name: '', cnpj: '', email: '', whatsapp: '', general: '', terms: '', rules: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

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
    setErrors({ personal_name: '', establishment_name: '', cnpj: '', email: '', whatsapp: '', general: '', terms: '', rules: '' });
    setSuccess(false);

    let hasErrors = false;
    const newErrors = { personal_name: '', establishment_name: '', cnpj: '', email: '', whatsapp: '', general: '', terms: '', rules: '' };

    if (!formData.personal_name.trim()) {
      newErrors.personal_name = 'O Nome Pessoal é obrigatório.';
      hasErrors = true;
    }

    if (!formData.establishment_name.trim()) {
      newErrors.establishment_name = 'O Nome do Estabelecimento é obrigatório.';
      hasErrors = true;
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'O CNPJ é obrigatório.';
      hasErrors = true;
    } else if (!isValidCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido. Verifique os números digitados.';
      hasErrors = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'O E-mail é obrigatório.';
      hasErrors = true;
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'O WhatsApp é obrigatório.';
      hasErrors = true;
    }

    if (!formData.category_id) {
      newErrors.general = 'Por favor, selecione uma tipologia.';
      hasErrors = true;
    }

    if (!termsAccepted) {
      newErrors.terms = 'Aceite obrigatório para continuar.';
      hasErrors = true;
    }
    
    if (!rulesAccepted) {
      newErrors.rules = 'Aceite obrigatório para continuar.';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Limpar o CNPJ antes de enviar pro banco
    const cleanCnpj = formData.cnpj.replace(/\D/g, '');
    const cleanPhone = formData.ddi + formData.whatsapp.replace(/\D/g, '');

    // Verificar duplicidade de email e whatsapp antes de inserir

    const normalizedEmail = formData.email.trim().toLowerCase();

    const { data: existingEmail } = await supabase.from('participants').select('id').eq('email', normalizedEmail).maybeSingle();
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

    const newParticipantId = crypto.randomUUID();

    const { error: insertError, data: insertData } = await supabase.from('participants').insert([{
      id: newParticipantId,
      personal_name: formData.personal_name.trim(),
      establishment_name: formData.establishment_name.trim(),
      cnpj: cleanCnpj,
      email: normalizedEmail,
      whatsapp: cleanPhone,
      category_id: formData.category_id,
      event_id: eventId || null
    }]);

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      
      const errMsg = insertError.message || '';
      if (errMsg.includes('participants_email_key') || errMsg.includes('duplicate key value') && errMsg.includes('email')) {
        setErrors(prev => ({ ...prev, email: 'Este e-mail já foi cadastrado no sorteio.' }));
      } else if (errMsg.includes('participants_whatsapp_key') || errMsg.includes('duplicate key value') && errMsg.includes('whatsapp')) {
        setErrors(prev => ({ ...prev, whatsapp: 'Este telefone já foi cadastrado no sorteio.' }));
      } else {
        setErrors(prev => ({ ...prev, general: `Ocorreu um erro ao enviar sua inscrição: ${errMsg || 'Verifique os dados'}` }));
      }
    } else {
      if (onSuccess) {
        onSuccess({ id: newParticipantId });
        setLoading(false);
        return;
      }
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
    <form className={styles.formContainer} onSubmit={handleSubmit} noValidate>

      <div>
        <input 
          type="text" 
          placeholder="Nome Pessoal *" 
          className="input-field" 
          required 
          value={formData.personal_name}
          onChange={handleNameChange}
          style={errors.personal_name ? { borderColor: '#ff4d4f' } : {}}
        />
        {errors.personal_name && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0.4rem 0 0 0' }}>{errors.personal_name}</p>}
      </div>
      
      <div>
        <input 
          type="text" 
          placeholder="Nome do Estabelecimento *" 
          className="input-field" 
          required 
          value={formData.establishment_name}
          onChange={(e) => setFormData({...formData, establishment_name: e.target.value})}
          style={errors.establishment_name ? { borderColor: '#ff4d4f' } : {}}
        />
        {errors.establishment_name && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0.4rem 0 0 0' }}>{errors.establishment_name}</p>}
      </div>
      
      <div>
        <input 
          type="text" 
          placeholder="CNPJ *" 
          className="input-field" 
          required 
          value={formData.cnpj}
          onChange={handleCnpjChange}
          style={errors.cnpj ? { borderColor: '#ff4d4f' } : {}}
        />
        {errors.cnpj && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0.4rem 0 0 0' }}>{errors.cnpj}</p>}
      </div>

      <div>
        <input 
          type="email" 
          placeholder="E-mail *" 
          className="input-field" 
          required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={errors.email ? { borderColor: '#ff4d4f' } : {}}
        />
        {errors.email && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0.4rem 0 0 0' }}>{errors.email}</p>}
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
            style={{ flex: 1, ...(errors.whatsapp ? { borderColor: '#ff4d4f' } : {}) }}
            required 
            value={formData.whatsapp}
            onChange={handlePhoneChange}
            maxLength={15}
          />
        </div>
        {errors.whatsapp && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0.4rem 0 0 0' }}>{errors.whatsapp}</p>}
      </div>

      <CustomSelect 
        placeholder="Selecione a Tipologia *"
        options={tipologiaOptions.length > 0 ? tipologiaOptions : [{ value: '', label: 'Nenhuma tipologia cadastrada' }]}
        value={formData.category_id}
        onChange={(val) => setFormData({...formData, category_id: val})}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.2rem', marginBottom: '0.5rem', textAlign: 'left' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: errors.terms ? '#ff4d4f' : '#fff' }}>
            <input 
              type="checkbox" 
              checked={termsAccepted} 
              onChange={(e) => setTermsAccepted(e.target.checked)} 
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span>Li e concordo com os Termos de Uso e a Política de Privacidade.</span>
          </label>
        </div>
        
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: errors.rules ? '#ff4d4f' : '#fff' }}>
            <input 
              type="checkbox" 
              checked={rulesAccepted} 
              onChange={(e) => setRulesAccepted(e.target.checked)} 
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span>
              Estou ciente e de acordo com as{' '}
              <span 
                style={{ color: '#B5E51D', textDecoration: 'underline' }} 
                onClick={(e) => {
                  e.preventDefault();
                  setShowRulesModal(true);
                }}
              >
                regras do sorteio
              </span>.
            </span>
          </label>
        </div>
        {(errors.terms || errors.rules) && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0' }}>Você precisa aceitar os termos de uso e as regras para continuar.</p>}
      </div>

      {errors.general && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', margin: '0' }}>{errors.general}</p>}

      <button type="submit" className="btn-primary" disabled={loading} style={{ margin: 0, marginTop: '-0.3rem' }}>
        {loading ? 'Enviando...' : 'Participar agora!'}
      </button>

      {showRulesModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ background: '#09233F', borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '100%', border: '1px solid #247AD8', position: 'relative' }}>
            <h3 style={{ color: '#B5E51D', marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>Regras do Sorteio</h3>
            <div style={{ color: '#FFF', fontSize: '1rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <p>Para receber o prêmio, é <strong>obrigatório</strong> estar presente no evento do JOTAJA.</p>
              <p>O sorteio será realizado exclusivamente no stand da Arcofoods.</p>
              <p>Caso a pessoa sorteada não esteja presente no momento do sorteio, um novo sorteio será realizado na sequência, até que um participante presente seja contemplado e receba o prêmio.</p>
              <p>Todo o processo de sorteio será gravado para garantir total transparência e comprovar a presença (ou ausência) dos sorteados no nosso stand.</p>
            </div>
            <button 
              type="button" 
              className="btn-primary" 
              style={{ marginTop: '2rem', width: '100%' }} 
              onClick={() => setShowRulesModal(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
