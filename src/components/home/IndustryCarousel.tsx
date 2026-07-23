import React from 'react';
import styles from './IndustryCarousel.module.css';

export default function IndustryCarousel() {
  return (
    <section className={styles.carousel} id="parceiros">
      <div className="container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p className={styles.carouselTitle}>
          Empresas e Indústrias Participantes
        </p>
      </div>
      <div className="container" style={{ overflow: 'hidden', padding: 0 }}>
        <div className={styles.carouselTrack}>
          {[...Array(14)].map((_, i) => (
            <div key={i} className={styles.carouselItem}>
              LOGO {i % 7 + 1}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
