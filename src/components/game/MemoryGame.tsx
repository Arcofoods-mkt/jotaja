"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import { createClient } from '@/utils/supabase/client';
import styles from './MemoryGame.module.css';

interface MemoryGameProps {
  participantId: string;
  settings: {
    grid_width: number;
    grid_height: number;
    time_limit_seconds: number;
    images: string[];
  };
  onFinish?: () => void;
}

interface CardType {
  id: number;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame({ participantId, settings, onFinish }: MemoryGameProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.time_limit_seconds);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [hasStarted, setHasStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const supabase = createClient();

  const totalPairs = (settings.grid_width * settings.grid_height) / 2;

  // Initialize game
  useEffect(() => {
    // Select the required number of images
    const selectedImages = settings.images.slice(0, totalPairs);
    
    // Duplicate to make pairs and shuffle (Fisher-Yates)
    const pairedImages = [...selectedImages, ...selectedImages];
    for (let i = pairedImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairedImages[i], pairedImages[j]] = [pairedImages[j], pairedImages[i]];
    }
    const shuffled = pairedImages;

    setCards(
      shuffled.map((imageUrl, index) => ({
        id: index,
        imageUrl,
        isFlipped: false,
        isMatched: false,
      }))
    );
  }, [settings, totalPairs]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || !hasStarted) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleGameOver(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState]);

  const handleGameOver = useCallback(async (won: boolean) => {
    setGameState(won ? 'won' : 'lost');
    
    if (won) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    try {
      const timeTaken = settings.time_limit_seconds - timeLeft;
      await supabase.from('memory_game_results').insert([{
        participant_id: participantId,
        won,
        time_taken_seconds: won ? timeTaken : settings.time_limit_seconds
      }]);
    } catch (err) {
      console.error('Error saving game result:', err);
    }
  }, [participantId, settings.time_limit_seconds, timeLeft, supabase]);

  const handleCardClick = (index: number) => {
    if (gameState !== 'playing') return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length >= 2) return; // Prevent clicking more than 2 at a time

    if (!hasStarted) {
      setHasStarted(true);
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Optimistically flip the card
    setCards((prev) => 
      prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c)
    );

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].imageUrl === cards[secondIndex].imageUrl) {
        // Match
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => 
            i === firstIndex || i === secondIndex ? { ...c, isMatched: true } : c
          ));
          setFlippedIndices([]);
          
          const newMatches = matches + 1;
          setMatches(newMatches);
          
          if (newMatches === totalPairs) {
            handleGameOver(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => 
            i === firstIndex || i === secondIndex ? { ...c, isFlipped: false } : c
          ));
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={styles.gameContainer}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className={styles.header}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
          Pares: {matches} / {totalPairs}
        </div>
        <div className={styles.timer} style={{ color: timeLeft <= 10 ? '#ff4d4f' : 'var(--accent-color)' }}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div 
        className={styles.grid} 
        style={{ 
          gridTemplateColumns: `repeat(${settings.grid_width}, 1fr)`
        }}
      >
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className={`${styles.card} ${card.isFlipped || card.isMatched ? styles.flipped : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className={`${styles.cardFace} ${styles.cardBack}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Imagens/arcofoods-favicon.svg" alt="Card Back" className={styles.cardBackLogo} />
            </div>
            <div className={`${styles.cardFace} ${styles.cardFront}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.imageUrl} alt="Card Front" />
            </div>
          </div>
        ))}
      </div>

      {gameState === 'won' && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>🎉 Você Venceu! 🎉</h2>
            <p className={styles.modalText}>
              Parabéns! Você encontrou todos os pares em <strong>{settings.time_limit_seconds - timeLeft} segundos</strong>.
              <br/><br/>
              Dirija-se à recepção do nosso stand para retirar o seu prêmio especial na hora!
              <br/><br/>
              Ah, e você já está automaticamente participando do nosso Sorteio! Boa sorte!
            </p>
            <button className="btn-primary" onClick={onFinish}>Voltar ao Início</button>
          </div>
        </div>
      )}

      {gameState === 'lost' && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle} style={{ color: '#ff4d4f' }}>Tempo Esgotado! ⏰</h2>
            <p className={styles.modalText}>
              Que pena, o seu tempo acabou!
              <br/><br/>
              Mas não fique triste: a sua inscrição foi realizada e você já está participando dos nossos grandes Sorteios!
              <br/><br/>
              Fique de olho!
            </p>
            <button className="btn-primary" onClick={onFinish}>Voltar ao Início</button>
          </div>
        </div>
      )}
    </div>
  );
}
