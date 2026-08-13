"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './AulasShow.module.css';
import { FiClock, FiUser, FiBriefcase, FiStar } from 'react-icons/fi';

const agenda = [
  {
    date: '18/08',
    label: 'Primeiro Dia',
    speakers: [
      { id: 1, name: 'Chef Ivan', company: 'Unilever', time: '10:15h às 11:00h', highlight: false, image: '/Imagens/chefivan.webp' },
      // { id: 2, name: 'Chef Raissa', company: 'Cargill', time: '13:45h às 14:30h', highlight: false, image: '/Imagens/chefraissa.webp' },
      { id: 7, name: 'Chef Elisa', company: 'Lactalis', time: '10:15h às 11:00h', highlight: false, image: '/Imagens/chefelisa.webp' },
      { id: 9, name: 'Chef Rafael', company: "RICH's", time: '10:15h às 11:00h', highlight: false, image: '/Imagens/chefrafael.webp' },
      // { id: 3, name: 'Chef Valnei', company: 'Barry Callebaut', time: '16:15h às 17:00h', highlight: false, image: '/Imagens/chefvalnei.webp' },
    ]
  },
  {
    date: '19/08',
    label: 'Segundo Dia',
    // isSpecial: true,
    speakers: [
      { id: 4, name: 'Chef Elisa', company: 'Lactalis', time: '10:15h às 11:00h', highlight: false, image: '/Imagens/chefelisa.webp' },
      { id: 5, name: 'Chef Ivan', company: 'Unilever', time: '13:00h às 13:45h', highlight: false, image: '/Imagens/chefivan.webp' },
      { id: 10, name: 'Chef Rafael', company: "RICH's", time: '10:15h às 11:00h', highlight: false, image: '/Imagens/chefrafael.webp' },
      // { id: 8, name: 'Chef Raissa', company: 'Cargill', time: '13:45h às 14:30h', highlight: false, image: '/Imagens/chefraissa.webp' },
      // { id: 6, name: 'Chef Heaven', company: 'Unilever Pro', time: '15:30h às 16:15h', highlight: true, image: '/Imagens/chefheaven.webp' },
    ]
  }
];

export default function AulasShow() {
  const [activeTab, setActiveTab] = useState(0);

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

        <div className={styles.tabsContainer}>
          {agenda.map((day, index) => (
            <button
              key={day.date}
              className={`${styles.tabButton} ${activeTab === index ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(index)}
            >
              <span className={styles.tabDate}>Dia {day.date}</span>
              <span className={styles.tabLabel}>{day.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.agendaWrapper}>
          <div className={styles.agendaList}>
            {agenda[activeTab].speakers.map((speaker, index) => (
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
