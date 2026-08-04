"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { formatCNPJ } from '@/utils/formatters';
import styles from './Roleta.module.css';
import Confetti from 'react-confetti';
import { FiArrowLeft } from 'react-icons/fi';

export default function RoletaPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [draw, setDraw] = useState<any>(null);
  const [eligibleParticipants, setEligibleParticipants] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Animation state
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  
  // Roleta strip
  const [stripItems, setStripItems] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchDrawData = async () => {
    if (!id) return;
    setLoading(true);
    
    // 1. Get Draw Details
    const { data: dData } = await supabase.from('draws').select('*').eq('id', id).single();
    if (dData) setDraw(dData);

    // 2. Get Winners of this draw
    const { data: wData, error: wError } = await supabase
      .from('draw_winners')
      .select('participant_id, created_at')
      .eq('draw_id', id)
      .order('created_at', { ascending: false });
      
    if (wError) {
      console.error("Error fetching winners:", wError);
      alert("Erro ao buscar histórico de vencedores: " + wError.message);
    }
      
    const winnerIds = wData ? wData.map(w => w.participant_id) : [];

    // 3. Get Participants in the basket
    const { data: pData, error: pError } = await supabase
      .from('draw_participants')
      .select('participants(id, personal_name, establishment_name, cnpj)')
      .eq('draw_id', id);
      
    if (pError) {
      console.error("Error fetching participants:", pError);
      alert("Erro ao buscar participantes elegíveis: " + pError.message);
    }
      
    if (pData) {
      const allParticipants = pData.map((p: any) => p.participants);
      
      // Build full winner objects for history
      if (wData) {
        const fullWinners = wData.map(w => {
          const pDetail = allParticipants.find((p: any) => p && p.id === w.participant_id);
          return {
            ...w,
            participants: pDetail
          };
        });
        setWinners(fullWinners);
      }
      
      // 4. Filter out the ones who already won
      const eligible = allParticipants.filter((p: any) => p && !winnerIds.includes(p.id));
      
      setEligibleParticipants(eligible);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchDrawData();
  }, [id]);

  const handleSpin = () => {
    if (eligibleParticipants.length === 0) {
      alert("Nenhum participante elegível restante!");
      return;
    }

    setIsSpinning(true);
    setShowWinnerModal(false);
    
    // Pick a random winner from backend logically
    const winnerIndex = Math.floor(Math.random() * eligibleParticipants.length);
    const selectedWinner = eligibleParticipants[winnerIndex];
    setWinner(selectedWinner);

    // Generate strip items (dummy items + winner at the end)
    // We want it to spin through ~40 items before stopping
    const stripSize = 40;
    const generatedStrip = [];
    for (let i = 0; i < stripSize; i++) {
      // Pick random dummy
      const rIdx = Math.floor(Math.random() * eligibleParticipants.length);
      generatedStrip.push(eligibleParticipants[rIdx]);
    }
    // Set the real winner near the end
    const winnerPos = stripSize - 3;
    generatedStrip[winnerPos] = selectedWinner;
    
    setStripItems(generatedStrip);

    // Start Animation slightly after state update
    setTimeout(() => {
      if (containerRef.current) {
        // Reset position to center index 0
        containerRef.current.style.transition = 'none';
        containerRef.current.style.transform = 'translateY(-60px)';
        
        // Force reflow
        void containerRef.current.offsetHeight;
        
        // Spin down to the winner position
        // Each item is 120px tall. Winner is at index winnerPos.
        // With top: 50%, to center index i we need translateY(-(60 + i * 120))
        const targetY = -(60 + winnerPos * 120); 
        
        containerRef.current.style.transition = 'transform 4s cubic-bezier(0.15, 0.85, 0.15, 1)';
        containerRef.current.style.transform = `translateY(${targetY}px)`;
        
        // Wait for animation to finish
        setTimeout(async () => {
          setIsSpinning(false);
          setShowWinnerModal(true);
          
          // Save winner to DB
          const { error: insertError } = await supabase.from('draw_winners').insert([{
            draw_id: id,
            participant_id: selectedWinner.id
          }]);
          
          if (insertError) {
            console.error("Error saving winner:", insertError);
            alert("Erro ao registrar vencedor no banco de dados! " + insertError.message);
          }
          
          // Refresh list quietly in background
          fetchDrawData();
        }, 4200);
      }
    }, 100);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#fff' }}>Preparando a roleta...</div>;
  }

  if (!draw) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>Sorteio não encontrado!</div>;
  }

  return (
    <div className={styles.container}>
      <button 
        className={styles.backBtn}
        onClick={() => router.push('/painel-administrador/sorteios')} 
      >
        <FiArrowLeft /> Voltar
      </button>

      <div className={styles.header}>
        <div className={styles.subtitle}>Sorteio Oficial</div>
        <h1 className={styles.title}>{draw.name}</h1>
        <div className={styles.stats}>
          <div className={styles.statBadge}>
            Participantes Elegíveis: <span className={styles.statValue}>{eligibleParticipants.length}</span>
          </div>
          <div className={styles.statBadge}>
            Já Sorteados: <span className={styles.statValue}>{winners.length}</span>
          </div>
        </div>
      </div>

      <div className={styles.roletaWindow}>
        <div className={styles.itemsContainer} ref={containerRef}>
          {stripItems.map((item, index) => (
            <div key={index} className={`${styles.item} ${!isSpinning && showWinnerModal && item.id === winner?.id ? styles.active : ''}`}>
              <div className={styles.itemName}>{item.personal_name}</div>
              <div className={styles.itemCompany}>{item.establishment_name}</div>
              <div className={styles.itemCnpj}>{formatCNPJ(item.cnpj)}</div>
            </div>
          ))}
          {stripItems.length === 0 && !isSpinning && (
            <div style={{ color: 'var(--text-muted)', marginTop: '4rem' }}>
              {eligibleParticipants.length > 0 ? "Pronto para girar!" : "Nenhum participante restante."}
            </div>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <button 
          className={styles.spinBtn} 
          onClick={handleSpin} 
          disabled={isSpinning || eligibleParticipants.length === 0}
        >
          {isSpinning ? 'Sorteando...' : 'Sortear Agora'}
        </button>
      </div>

      {winners.length > 0 && (
        <div style={{ marginTop: '3rem', width: '100%', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏆</span> Histórico de Sorteados neste Evento
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {winners.map((w, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--accent-color)' }}>{w.participants?.personal_name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{w.participants?.establishment_name}</div>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
                  {new Date(w.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showWinnerModal && winner && (
        <div className={styles.winnerOverlay}>
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />
          <div className={styles.winnerCard}>
            <div className={styles.winnerTrophy}>🏆</div>
            <div className={styles.winnerLabel}>E O VENCEDOR É...</div>
            <div className={styles.winnerName}>{winner.personal_name}</div>
            <div className={styles.winnerCompany}>{winner.establishment_name}</div>
            <div className={styles.winnerCnpj}>CNPJ: {formatCNPJ(winner.cnpj)}</div>
            
            <button className={styles.closeBtn} onClick={() => setShowWinnerModal(false)}>
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
