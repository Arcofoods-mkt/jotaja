import React from 'react';
import Image from 'next/image';
import styles from './IndustryCarousel.module.css';

const logos = [
  { src: '/Imagens/unilever-pro_cinza.svg', alt: 'Unilever Pro' },
  { src: '/Imagens/lactalis_cinza.svg', alt: 'Lactalis' },
  { src: '/Imagens/unilever-food-solutions_cinza.svg', alt: 'Unilever Food Solutions' },
  { src: '/Imagens/cargill_cinza.svg', alt: 'Cargill' },
];

export default function IndustryCarousel() {
  return (
    <section className={styles.carousel} id="parceiros">
      <div className="container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className={styles.carouselTitle}>
          Indústrias Parceiras
        </h2>
      </div>
      <div className="container" style={{ overflow: 'hidden', padding: 0 }}>
        <div className={styles.carouselTrack}>
          {Array(10).fill(logos).flat().map((logo, i) => (
            <div key={i} className={styles.carouselItem}>
              <Image 
                src={logo.src} 
                alt={logo.alt} 
                width={200}
                height={110}
                style={{ maxWidth: '200px', maxHeight: '110px', objectFit: 'contain' }} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
