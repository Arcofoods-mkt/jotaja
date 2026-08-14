"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import SorteioForm from '@/components/home/SorteioForm';
import LoginParticipant from '@/components/game/LoginParticipant';
import MemoryGame from '@/components/game/MemoryGame';
import { createClient } from '@/utils/supabase/client';
import styles from './GamePage.module.css';

export default function GamePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showLogin, setShowLogin] = useState(false);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [tipologiaOptions, setTipologiaOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      
      // Fetch Tipologias for the form
      const { data: catData } = await supabase
        .from('categories')
        .select('id, name')
        .eq('type', 'tipologia')
        .order('name');
        
      if (catData) {
        setTipologiaOptions(catData.map(c => ({ value: c.id, label: c.name })));
      }

      // Fetch active memory game settings
      const { data: setData } = await supabase
        .from('memory_game_settings')
        .select('*')
        .eq('active', true)
        .limit(1)
        .maybeSingle();
        
      if (setData) {
        setSettings(setData);
      }

      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const handleGameStart = async (partId: string) => {
    // Verificar se já jogou algum jogo
    const { data: memData } = await supabase.from('memory_game_results').select('id').eq('participant_id', partId).maybeSingle();
    if (memData) {
      alert("Você já participou de um dos jogos! Só é permitido jogar uma única vez.");
      return;
    }
    const { data: burData } = await supabase.from('burger_game_results').select('id').eq('participant_id', partId).maybeSingle();
    if (burData) {
      alert("Você já participou de um dos jogos! Só é permitido jogar uma única vez.");
      return;
    }

    setParticipantId(partId);
    setStep(2);
  };

  const handleFormSuccess = (participantData: any) => {
    if (participantData && participantData.id) {
      handleGameStart(participantData.id);
    } else {
      // Se não houver ID (fallback), mostramos o sucesso normal
      alert("Inscrição concluída, mas não foi possível iniciar o jogo.");
    }
  };

  const handleGameFinish = () => {
    // Reset para nova jogada
    setStep(1);
    setParticipantId(null);
  };

  if (loading) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.loadingBox}>Carregando...</div>
        </div>
      </main>
    );
  }

  if (!settings || !settings.images || settings.images.length === 0) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.errorBox}>
            O jogo da memória está indisponível no momento.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageContainer}>
      <div className={styles.topHeader}>
        <Link href="/" className={styles.backButton}>
          <FiArrowLeft /> Voltar
        </Link>
      </div>
      
      <div className={styles.contentWrapper}>
        {step === 1 && (
          <div className={styles.formSection}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <Image 
                src="/Imagens/Preencha jogue e ganhe.webp" 
                alt="Preencha, jogue e ganhe!" 
                width={400} 
                height={120} 
                style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }} 
              />
            </div>
            <p className={styles.description}>
              Inscreva-se para o grande sorteio, vença o Jogo da Memória e <span style={{ color: '#B5E51D' }}>garanta um brinde na hora!</span>
            </p>
            {!showLogin ? (
              <>
                <SorteioForm 
                  tipologiaOptions={tipologiaOptions} 
                  onSuccess={handleFormSuccess}
                  transparentForm={true}
                />
                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#fff' }}>
                  Já é inscrito? <span style={{ color: '#B5E51D', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setShowLogin(true)}>Acesse para jogar</span>
                </p>
              </>
            ) : (
              <>
                <LoginParticipant onSuccess={handleGameStart} transparentForm={true} />
                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#fff' }}>
                  Ainda não é inscrito? <span style={{ color: '#B5E51D', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setShowLogin(false)}>Inscreva-se</span>
                </p>
              </>
            )}
          </div>
        )}

        {step === 2 && participantId && (
          <MemoryGame 
            participantId={participantId} 
            settings={settings} 
            onFinish={handleGameFinish} 
          />
        )}
      </div>
    </main>
  );
}
