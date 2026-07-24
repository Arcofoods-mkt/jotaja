"use client";
import React, { useState, useEffect } from 'react';
import styles from './AboutSection.module.css';

const imagesData = [
  { id: 1, text: "Foto 2025 1" },
  { id: 2, text: "Foto 2025 2" }
];

export default function AboutSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imagesData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.aboutSection} id="sobre">
      <div className={`container ${styles.aboutGrid}`}>
        <div className={styles.aboutContent}>
          <h2 className={styles.aboutTitle}>
            <span style={{ whiteSpace: 'nowrap' }}>O que rolou em 2025 e</span><br />
            <span style={{ whiteSpace: 'nowrap' }}>o que esperar de 2026</span>
          </h2>
          <p className={styles.text}>
            O JotaJá Summit já se consolidou como o maior ponto de encontro para quem quer acelerar os negócios. No ano passado, lotamos os auditórios e geramos milhões em negócios fechados.
          </p>
          <p className={styles.text}>
            Nesta nova edição, teremos palestras exclusivas, oportunidades de networking inigualáveis e muito mais. Prepare-se para elevar sua empresa de patamar.
          </p>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Muito Networking
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Rodadas de Negócios
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Inovações do Varejo
            </li>
          </ul>
        </div>
        
        <div className={styles.hybridCarouselContainer}>
          {imagesData.map((img, index) => (
            <div 
              key={img.id} 
              className={`${styles.hybridSlide} ${index === currentIndex ? styles.active : ''}`}
            >
              {img.text}
            </div>
          ))}
          <div className={styles.hybridIndicators}>
            {imagesData.map((_, index) => (
              <button 
                key={index}
                type="button"
                className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ir para foto ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
