"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import SorteioForm from '@/components/home/SorteioForm';
import MemoryGame from '@/components/game/MemoryGame';
import { createClient } from '@/utils/supabase/client';
import styles from './GamePage.module.css';

export default function GamePage() {
  const [step, setStep] = useState<1 | 2>(1);
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

  const handleFormSuccess = (participantData: any) => {
    if (participantData && participantData.id) {
      setParticipantId(participantData.id);
      setStep(2);
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
      <Link href="/" className={styles.backButton}>
        <FiArrowLeft /> Voltar
      </Link>
      
      <div className={styles.contentWrapper}>
        {step === 1 && (
          <div className={styles.formSection}>
            <h1 className={styles.title}>
              <span>Preencha,</span>
              <span>jogue e ganhe!</span>
            </h1>
            <p className={styles.description}>
              Preencha seus dados para concorrer ao nosso grande sorteio! E tem mais: 
              divirta-se no nosso Jogo da Memória e, se vencer o desafio, garanta um brinde exclusivo na hora.
            </p>
            <SorteioForm 
              tipologiaOptions={tipologiaOptions} 
              onSuccess={handleFormSuccess}
            />
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
