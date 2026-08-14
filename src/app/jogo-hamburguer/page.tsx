"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft } from 'react-icons/fi';
import SorteioForm from '@/components/home/SorteioForm';
import LoginParticipant from '@/components/game/LoginParticipant';
import BurgerGame from '@/components/game/BurgerGame';
import { createClient } from '@/utils/supabase/client';
import styles from '../game/GamePage.module.css';

export default function BurgerGamePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showLogin, setShowLogin] = useState(false);
  const [participantId, setParticipantId] = useState<string | null>(null);
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

      setLoading(false);
    };

    fetchInitialData();
  }, [supabase]);

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

  return (
    <main className={styles.pageContainer} style={{ position: 'relative', overflow: 'hidden' }}>
      
      <div className={styles.contentWrapper} style={{ position: 'relative', zIndex: 10 }}>
        {step === 1 && (
          <>
            {/* Decorative Elements - Background Textures/Glows */}
            <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
              <Image src="/Imagens/verdetopo.webp" alt="Detalhe verde topo" width={400} height={400} style={{ objectFit: 'contain', opacity: 0.8, maxWidth: '40vw', height: 'auto' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 0, pointerEvents: 'none' }}>
              <Image src="/Imagens/verderodape.webp" alt="Detalhe verde rodape" width={400} height={400} style={{ objectFit: 'contain', opacity: 0.8, maxWidth: '40vw', height: 'auto' }} />
            </div>

            {/* Decorative Elements - Burgers */}
            <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1, pointerEvents: 'none', transform: 'translate(25%, -25%) rotate(15deg)' }}>
              <Image src="/Imagens/burger1.webp" alt="Burger Top Right" width={400} height={400} style={{ objectFit: 'contain', maxWidth: '35vw', height: 'auto' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1, pointerEvents: 'none', transform: 'translate(-25%, 25%) rotate(-15deg)' }}>
              <Image src="/Imagens/burger2.webp" alt="Burger Bottom Left" width={400} height={400} style={{ objectFit: 'contain', maxWidth: '35vw', height: 'auto' }} />
            </div>
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
            <p className={styles.description} style={{ marginTop: '0', marginBottom: '2rem', lineHeight: '1.4' }}>
              Inscreva-se para o grande sorteio, vença o Jogo do Hambúrguer e <span style={{ color: '#B5E51D' }}>garanta um brinde na hora!</span>
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
          </>
        )}

        {step === 2 && participantId && (
          <BurgerGame 
            participantId={participantId} 
            onFinish={handleGameFinish} 
          />
        )}
      </div>
    </main>
  );
}
