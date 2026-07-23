import React from 'react';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={styles.aboutSection} id="sobre">
      <div className={`container ${styles.aboutGrid}`}>
        <div className={styles.aboutContent}>
          <h2>O que rolou em 2025 e o que esperar de 2026</h2>
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
        <div className={styles.aboutImages}>
          <div className={`glass ${styles.imgPlaceholder} ${styles.img1}`}>Foto 2025</div>
          <div className={`glass ${styles.imgPlaceholder} ${styles.img2}`}>Foto 2025</div>
        </div>
      </div>
    </section>
  );
}
