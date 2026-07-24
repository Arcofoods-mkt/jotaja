import React from 'react';
import styles from './AboutSection.module.css';

export default function AboutSectionArcofoods() {
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
        <div className={styles.aboutImages}>
          <div className={`glass ${styles.imgPlaceholder} ${styles.img1}`}>Foto Barra</div>
          <div className={`glass ${styles.imgPlaceholder} ${styles.img2}`}>Foto CD</div>
        </div>
      </div>
    </section>
  );
}
