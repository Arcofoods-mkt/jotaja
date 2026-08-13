"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import { createClient } from '@/utils/supabase/client';
import styles from './BurgerGame.module.css';

// --- Dados Iniciais ---
const RECIPE = [
  { id: 'ing-1', name: 'Pão sem Gergelim', brand: 'PADERRI', img: '/Imagens/pão da paderri.webp', correctSlot: 0 },
  { id: 'ing-2', name: 'Maionese de churrasco', brand: 'HELLMANN\'S', img: '/Imagens/hellmanns churrasco maionese.webp', correctSlot: 1 },
  { id: 'ing-3', name: 'Alface', brand: '', img: '/Imagens/alface.webp', correctSlot: 2 },
  { id: 'ing-4', name: 'Tomate', brand: '', img: '/Imagens/tomate.webp', correctSlot: 3 },
  { id: 'ing-5', name: 'Queijo cheddar', brand: 'PRESIDENT', img: '/Imagens/cheddar president.webp', correctSlot: 4 },
  { id: 'ing-6', name: 'Carne de Hambúrguer', brand: 'CHULETÃO', img: '/Imagens/chuletao.webp', correctSlot: 5 },
  { id: 'ing-7', name: 'Molho para Burger', brand: 'HELLMANN\'S', img: '/Imagens/hellmanns burguer maionese.webp', correctSlot: 6 },
  { id: 'ing-8', name: 'Pão sem Gergelim', brand: 'PADERRI', img: '/Imagens/pão da paderri.webp', correctSlot: 7 },
];

interface BurgerGameProps {
  participantId: string;
  onFinish?: () => void;
}

// --- Componentes DnD auxiliares ---
function DraggableIngredient({ id, ingredient }: { id: string, ingredient: any }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: ingredient,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${styles.ingredientItem} ${isDragging ? styles.dragging : ''}`}
    >
      <Image src={ingredient.img} alt={ingredient.name} width={80} height={80} style={{ objectFit: 'contain' }} draggable={false} />
    </div>
  );
}

function DroppableSlot({ id, index, currentIngredient }: { id: string, index: number, currentIngredient: any | null }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { index },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.slot} ${isOver ? styles.slotOver : ''} ${currentIngredient ? styles.slotFilled : ''}`}
    >
      <div className={styles.slotNumber}>{index + 1}</div>
      {currentIngredient && (
        <DraggableIngredient id={currentIngredient.id} ingredient={currentIngredient} />
      )}
    </div>
  );
}

export default function BurgerGame({ participantId, onFinish, initialState = 'rules' }: BurgerGameProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [memorizeTime, setMemorizeTime] = useState(10);
  const [isPeek, setIsPeek] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [penalty, setPenalty] = useState(0);
  
  // Estado das posições (null significa vazio, caso contrário tem o objeto do ingrediente)
  const [slots, setSlots] = useState<(typeof RECIPE[0] | null)[]>(Array(8).fill(null));
  const [pool, setPool] = useState<(typeof RECIPE[0])[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  // Inicializa o pool de ingredientes embaralhados
  useEffect(() => {
    const shuffled = [...RECIPE].sort(() => Math.random() - 0.5);
    setPool(shuffled);
  }, []);

  // Timer da Memorização (Tela 3)
  useEffect(() => {
    if (gameState === 'memorizing') {
      const timer = setInterval(() => {
        setMemorizeTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('assembly');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  // Timer da Montagem (Tela 4)
  useEffect(() => {
    if (gameState === 'assembly') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishGame(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const handleStartGame = () => {
    setMemorizeTime(10);
    setIsPeek(false);
    setGameState('memorizing');
  };

  const handlePeek = () => {
    // Penalidade: perde 10 segundos do tempo restante
    setTimeLeft(prev => Math.max(0, prev - 10));
    setPenalty(prev => prev + 10);
    
    // Mostra tela de memorização por 5 segundos
    setMemorizeTime(5);
    setIsPeek(true);
    setGameState('memorizing');
  };

  const handleFinishGame = async (finalTimeLeft: number) => {
    setGameState('finished');
    
    // Validação
    let isCorrect = true;
    for (let i = 0; i < 8; i++) {
      if (!slots[i] || slots[i]?.correctSlot !== i) {
        // Se a lógica diz que os pães (mesma imagem) podem trocar, precisaríamos de uma checagem mais branda,
        // mas aqui forçamos o ID exato pelo correctSlot.
        // Como o pão de cima e o de baixo são idênticos em nome e imagem, vamos flexibilizar a checagem:
        if (slots[i]?.name === RECIPE[i].name) {
          continue; // Pães iguais podem ser trocados entre si
        }
        isCorrect = false;
        break;
      }
    }

    // Salvar no BD
    try {
      const timeTaken = 60 - finalTimeLeft; // tempo total gasto
      await supabase.from('burger_game_results').insert([{
        participant_id: participantId,
        won: isCorrect,
        time_taken_seconds: timeTaken + penalty, // O tempo gasto já inclui a perda dos 10s porque tiramos do timeLeft
      }]);
    } catch (err) {
      console.error('Erro ao salvar resultado:', err);
    }
  };

  // DnD Handlers
  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveDragId(null);
    const { active, over } = event;
    
    if (!over) return; // Soltou fora de qualquer lugar (volta pra onde tava)

    const activeIng = RECIPE.find(r => r.id === active.id)!;
    const overId = over.id as string; // 'pool' ou 'slot-X'

    // Remover de onde estava
    let prevSlots = [...slots];
    let prevPool = [...pool];
    
    // Descobrir onde estava antes
    const slotIndex = prevSlots.findIndex(s => s?.id === active.id);
    if (slotIndex !== -1) {
      prevSlots[slotIndex] = null;
    } else {
      prevPool = prevPool.filter(p => p.id !== active.id);
    }

    // Colocar no novo lugar
    if (overId === 'pool') {
      prevPool.push(activeIng);
      setSlots(prevSlots);
      setPool(prevPool);
    } else if (overId.startsWith('slot-')) {
      const targetIndex = parseInt(overId.split('-')[1], 10);
      const occupant = prevSlots[targetIndex];
      
      if (occupant) {
        // Swap: o ocupante vai pro pool
        prevPool.push(occupant);
      }
      prevSlots[targetIndex] = activeIng;
      
      setSlots(prevSlots);
      setPool(prevPool);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Encontra o ingrediente ativo para o Overlay
  const activeIngredient = activeDragId ? RECIPE.find(r => r.id === activeDragId) : null;

  return (
    <div className={styles.gameContainer}>
      
      {/* TELA 2: Regras */}
      {gameState === 'rules' && (
        <div className={styles.rulesScreen}>
          <Image 
            src="/Imagens/Regras do jogo.webp" 
            alt="Regras do jogo" 
            width={300} 
            height={100} 
            style={{ objectFit: 'contain', marginBottom: '2rem' }} 
          />
          
          <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
            <div className={styles.rulesContent} style={{ maxWidth: '100%', margin: '0 0 2rem 0' }}>
              <p><span className={styles.highlight}>Memorize:</span> A foto do hambúrguer aparecerá por apenas 10 segundos.</p>
              <p><span className={styles.highlight}>Monte:</span> Quando a imagem sumir, recrie o hambúrguer na mesma ordem.</p>
              <p><span className={styles.highlight}>Atenção:</span> Você pode rever a foto original, mas cada "espiada" custa 10 segundos!</p>
            </div>

            <div style={{ width: '100%', height: '220px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>Espaço para Vídeo (Ex: iframe do YouTube)</span>
            </div>

            <button className={styles.btnPrimary} onClick={handleStartGame} style={{ maxWidth: '100%', width: '100%' }}>Iniciar</button>
          </div>
        </div>
      )}

      {/* TELA 3: Memorizar */}
      {gameState === 'memorizing' && (
        <div className={styles.memorizeScreen}>
          <div className={styles.memorizeTimerBlock} style={{ margin: '0' }}>
            00:{memorizeTime < 10 ? `0${memorizeTime}` : memorizeTime}
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
            <div className={styles.memorizeLayout}>
              <div className={styles.memorizeLeft}>
                <div className={styles.desktopBurger}>
                  <Image 
                    src="/Imagens/hamburguer.webp" 
                    alt="Hambúrguer" 
                    width={500} 
                    height={600} 
                    className={styles.memorizeImage}
                  />
                </div>
                <div className={styles.mobileBurger}>
                  <Image 
                    src="/Imagens/burgermobile.webp" 
                    alt="Hambúrguer Mobile" 
                    width={400} 
                    height={800} 
                    className={styles.memorizeImageMobile}
                  />
                </div>
              </div>
              
              <div className={styles.memorizeRight}>
                <Image 
                  src="/Imagens/lista.webp" 
                  alt="Lista de Ingredientes" 
                  width={350} 
                  height={550} 
                  className={styles.memorizeImage}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TELA 4: Montagem */}
      {gameState === 'assembly' && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className={styles.assemblyScreen}>
            <div className={styles.assemblyLayout}>
              
              {/* Esquerda: Pool de Ingredientes */}
              <div className={styles.poolArea}>
                <DroppablePool id="pool">
                  {pool.map(ing => (
                    <DraggableIngredient key={ing.id} id={ing.id} ingredient={ing} />
                  ))}
                </DroppablePool>
              </div>

              {/* Direita: Slots de 1 a 8 */}
              <div className={styles.slotsArea}>
                {slots.map((occupant, idx) => (
                  <DroppableSlot key={idx} id={`slot-${idx}`} index={idx} currentIngredient={occupant} />
                ))}
              </div>
            </div>
            
            {/* Rodapé da Montagem */}
            <div className={styles.assemblyFooter}>
              <div className={styles.assemblyTimer}>
                {formatTime(timeLeft)}
              </div>
              <div className={styles.assemblyActions}>
                <button className={styles.btnSecondary} onClick={handlePeek}>
                  -10s. Ver novamente
                </button>
                <button className={styles.btnFinish} onClick={() => handleFinishGame(timeLeft)}>
                  Finalizar
                </button>
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeIngredient ? (
              <div className={styles.ingredientItemOverlay}>
                <Image src={activeIngredient.img} alt={activeIngredient.name} width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* TELA 5: Resultado (Extraída para quando clica em Finalizar) */}
      {gameState === 'finished' && (
        <div className={styles.finishedScreen}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Jogo Encerrado!</h2>
            <p className={styles.modalText}>
              Você levou <strong>{60 - timeLeft} segundos</strong>. <br/>
              Penalidades de espiada: {penalty} segundos.
              <br/><br/>
              A sua montagem foi avaliada e a pontuação já está no Ranking!
            </p>
            <button className={styles.btnPrimary} onClick={onFinish}>Voltar ao Início</button>
          </div>
        </div>
      )}

    </div>
  );
}

// Componente Droppable extra para a área da mesa (pool)
function DroppablePool({ id, children }: { id: string, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={styles.poolContainer}>
      {children}
    </div>
  );
}
