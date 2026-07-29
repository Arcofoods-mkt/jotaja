"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './OQueEsperar.module.css';

const imagesData = [
  { id: 1, src: "/Imagens/cd1.webp", alt: "Centro de Distribuição 1" },
  { id: 2, src: "/Imagens/cd2.webp", alt: "Centro de Distribuição 2" }
];

export default function AboutSectionArcofoods() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imagesData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.aboutSection} id="sobre-arcofoods">
      <div className={`container ${styles.aboutGrid}`}>
        <div className={styles.aboutContent}>
          <h2>Sobre a Arcofoods</h2>
          <p className={styles.text}>
            A Arcofoods possui uma estrutura logística eficiente, desenvolvida para atender seus clientes com agilidade, segurança e excelência.
          </p>
          <p className={styles.text}>
            Com um dos portfólios mais completos do mercado de food service do Rio de Janeiro, oferece um mix diversificado de produtos, sempre apoiado por parcerias com as principais indústrias do setor.
          </p>
        </div>
        
        <div className={styles.carouselContainer}>
          {imagesData.map((img, index) => (
            <div 
              key={img.id} 
              className={`${styles.carouselSlide} ${index === currentIndex ? styles.active : ''}`}
            >
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill
                style={{ objectFit: 'cover' }} 
              />
            </div>
          ))}
          <div className={styles.carouselIndicators}>
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
