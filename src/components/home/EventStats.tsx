import React from 'react';
import styles from './EventStats.module.css';

export default function EventStats() {
  return (
    <section className={`container ${styles.statsSection}`}>
      <h2 className={styles.statsTitle}>
        A SUA VIRADA COMEÇA AQUI!
      </h2>
      <p className={styles.statsSubtitle}>
        DA TEORIA À PRÁTICA, O EVENTO QUE MUDA O JOGO.
      </p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>3.000</div>
          <div className={styles.statLabel}>PARTICIPANTES</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>70+</div>
          <div className={styles.statLabel}>STANDS</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>2 DIAS</div>
          <div className={styles.statLabel}>DE IMERSÃO</div>
        </div>
      </div>
    </section>
  );
}
