"use client";
import React from 'react';
import Image from 'next/image';
import styles from './AulasShow.module.css';
import { FiClock, FiUser, FiBriefcase, FiStar } from 'react-icons/fi';

const speakers = [
  { id: 1, name: 'Chef Ivan', company: 'Unilever', highlight: false, image: '/Imagens/chefivan.webp' },
  { id: 7, name: 'Chef Elisa', company: 'Lactalis', highlight: false, image: '/Imagens/chefelisa.webp' },
  { id: 9, name: 'Chef Rafael', company: "RICH's", highlight: false, image: '/Imagens/chefrafael.webp' },
  { id: 11, name: 'Chef Julio', company: 'Pão de Alho do Julio', highlight: false, image: '/Imagens/chefjulio.webp' }
];

export default function AulasShow() {
  return (
    <section className={styles.aulasSection} id="aulas-show">
      <div className={styles.glowBackground}></div>
      <div className={`container ${styles.container}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.badge}>Line-up Exclusivo</span>
          <h2 className={styles.title}>AGENDA AULAS SHOW</h2>
          <p className={styles.subtitle}>
            Prepare-se para experiências gastronômicas incríveis com os melhores chefs e as maiores marcas do mercado.
          </p>
        </div>

        <div className={styles.agendaWrapper}>
          <div className={styles.agendaList}>
            {speakers.map((speaker, index) => (
              <div 
                key={speaker.id} 
                className={`${styles.agendaCard} ${speaker.highlight ? styles.highlightCard : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {speaker.highlight && (
                  <div className={styles.highlightBadge}>
                    <FiStar className={styles.starIcon} />
                  </div>
                )}
                
                <div className={styles.imagePlaceholder}>
                  {speaker.image ? (
                    <Image 
                      src={speaker.image} 
                      alt={`Foto de ${speaker.name}`} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                    />
                  ) : (
                    <FiUser className={styles.placeholderIcon} />
                  )}
                </div>
                
                <div className={styles.cardContent}>
                  <h4 className={styles.speakerName}>{speaker.name}</h4>
                  <div className={styles.companyTag}>
                    <FiBriefcase className={styles.companyIcon} />
                    {speaker.company}
                  </div>
                  
                  {/* <div className={styles.timeBlock}>
                    <FiClock className={styles.timeIcon} />
                    <span>{speaker.time}</span>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
