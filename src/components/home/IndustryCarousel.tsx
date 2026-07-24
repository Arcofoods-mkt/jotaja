import React from 'react';
import styles from './IndustryCarousel.module.css';

const logos = [
  { src: '/Imagens/unilever-pro_cinza.svg', alt: 'Unilever Pro' },
  { src: '/Imagens/callebaut_cinza.svg', alt: 'Callebaut' },
  { src: '/Imagens/lactalis_cinza.svg', alt: 'Lactalis' },
  { src: '/Imagens/unilever-food-solutions_cinza.svg', alt: 'Unilever Food Solutions' },
  { src: '/Imagens/cargill_cinza.svg', alt: 'Cargill' },
];

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
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} className={styles.carouselItem}>
              <img src={logo.src} alt={logo.alt} style={{ maxWidth: '200px', maxHeight: '110px', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
