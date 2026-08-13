"use client";

import React from 'react';
import BurgerGame from '@/components/game/BurgerGame';
import styles from '../game/GamePage.module.css';

export default function TesteTela3() {
  return (
    <main className={styles.pageContainer} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className={styles.contentWrapper} style={{ position: 'relative', zIndex: 10, padding: 0 }}>
        <BurgerGame 
          participantId="00000000-0000-0000-0000-000000000000" 
          onFinish={() => alert('Jogo finalizado!')} 
          initialState="assembly" 
        />
      </div>
    </main>
  );
}
