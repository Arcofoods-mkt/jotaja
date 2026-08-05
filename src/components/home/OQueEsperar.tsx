import React from 'react';
import Image from 'next/image';
import styles from './OQueEsperar.module.css';
import { FiStar, FiGift } from 'react-icons/fi';
import { LuChefHat, LuSnowflake } from 'react-icons/lu';

export default function OQueEsperar() {
  return (
    <section className={styles.heroicSection} id="sobre">
      <div className="container">
        <h2 className={styles.heroicTitle}>
          Conheça a <span>Arco Experience</span>
        </h2>
        <p className={styles.heroicSubtitle}>
          <span className={styles.desktopText}>
            Esqueça tudo o que você sabe sobre distribuição. No <strong>JotaJá Summit 2026</strong>, a Arcofoods não vai apenas expor produtos, vai abrir as portas para o futuro do seu negócio através de uma experiência tecnológica e imersiva.
          </span>
          <span className={styles.mobileText}>
            Esqueça tudo o que você sabe sobre distribuição. Vai abrir novas possibilidades para o futuro do seu negócio através de uma experiência tecnológica e imersiva.
          </span>
        </p>

        <h3 className={styles.featuresSubtitle}>
          O que esperar da Arco no JotaJá 2026
        </h3>

        <div className={styles.heroicFeatures}>
          <div className={styles.heroicCard}>
            <div className={styles.heroicIcon}><LuSnowflake /></div>
            <h3 className={styles.heroicCardTitle}>Novas categorias de SKUs</h3>
            <p className={styles.heroicCardText}>
              Descubra lançamentos exclusivos para destacar o seu menu.
            </p>
          </div>

          <div className={styles.heroicCard}>
            <div className={styles.heroicIcon}><LuChefHat /></div>
            <h3 className={styles.heroicCardTitle}>Aulas Show</h3>
            {/* <div className={`${styles.mysteryTag} ${styles.mysteryTagMobile}`}>
              <FiStar className={styles.mysteryIcon} /> Chef Heaven Confirmada
            </div> */}
            <p className={styles.heroicCardText}>
              Insights práticos para revolucionar a gestão do seu negócio.
            </p>
          </div>

          <div className={styles.heroicCard} style={{ borderColor: 'var(--accent-color)', background: 'rgba(148, 196, 28, 0.03)', position: 'relative' }}>
            <div className={styles.heroicIcon}><FiGift /></div>
            <h3 className={styles.heroicCardTitle}>Bônus Especial</h3>
            <p className={styles.heroicCardText}>
              Uma grande oportunidade espera por você logo abaixo.
            </p>

            <Image 
              src="/Imagens/seta.svg" 
              alt="Seta" 
              width={600} 
              height={250} 
              className={styles.drawnArrow} 
            />
          </div>
        </div>

        <div className={styles.mobileArrowContainer}>
          <Image 
            src="/Imagens/seta2.svg" 
            alt="Seta para baixo" 
            width={80} 
            height={120} 
            className={styles.drawnArrowMobile} 
          />
        </div>
      </div>
    </section>
  );
}
