import React from 'react';
import Topbar from '../Topbar';
import CustomSelect from '../CustomSelect';
import styles from './HeroSection.module.css';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className={styles.heroBg}>
      <Image
        src="/Imagens/hero.webp"
        alt="JotaJá Summit Background"
        fill
        priority
        unoptimized
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
      />
      <div className={styles.heroOverlay} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Topbar />
      </div>
      <div className={`container ${styles.hero}`} style={{ position: 'relative', zIndex: 2 }}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span>Venha visitar o</span> <br />
            <span className={`text-gradient font-display ${styles.highlightText}`}>nosso stand!</span>
          </h1>
          <p className={styles.description}>
            Conecte-se com as maiores indústrias, descubra inovações do mercado e transforme seus resultados em 2 dias de imersão total.
          </p>

          <div className={styles.saveTheDate}>
            <span className={styles.saveTheDateTitle}>SAVE THE DATE</span>
            <span className={`${styles.saveTheDateText} ${styles.desktopText}`}>
              18 e 19 de Agosto • 08:00 às 20:00
            </span>
            <span className={`${styles.saveTheDateText} ${styles.mobileText}`}>
              18 e 19 de agosto<br />
              08:00 às 20:00
            </span>
          </div>

          {/* Seção temporariamente oculta */}
          {false && (
            <div className={styles.advantagesBox}>
              <h4 className={styles.advantagesTitle}>Por que se inscrever agora?</h4>
              <div className={styles.advantageItem}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span className={styles.advantageText}>Garanta sua vaga no <strong>maior evento</strong> do setor</span>
              </div>
              <div className={styles.advantageItem}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span className={styles.advantageText}>Participe de <strong>sorteios exclusivos</strong> durante os 2 dias de evento</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
