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
          Esqueça tudo o que você sabe sobre distribuição. No <strong>JotaJá Summit 2026</strong>, a Arcofoods não vai apenas expor produtos, nós vamos abrir as portas para o futuro do seu negócio através de uma experiência tecnológica e imersiva.
        </p>

        <h3 className={styles.featuresSubtitle}>
          O que esperar da Arco no JotaJá 2026
        </h3>

        <div className={styles.heroicFeatures}>
          <div className={styles.heroicCard}>
            <div className={styles.heroicIcon}><LuSnowflake /></div>
            <h3 className={styles.heroicCardTitle}>Novas Categorias</h3>
            <p className={styles.heroicCardText}>
              Descubra lançamentos exclusivos e inovações do nosso portfólio. Produtos pensados estrategicamente para destacar o seu menu e atrair mais clientes.
            </p>
          </div>
          
          <div className={styles.heroicCard}>
            <div className={styles.heroicIcon}><FiStar /></div>
            <h3 className={styles.heroicCardTitle}>Chef</h3>
            <p className={styles.heroicCardText}>
              Uma verdadeira aula de alta culinária. Descubra os segredos e técnicas exclusivas de quem conquistou o maior reality show de gastronomia do mundo.
            </p>
          </div>

          <div className={styles.heroicCard}>
            <div className={styles.heroicIcon}><LuChefHat /></div>
            <h3 className={styles.heroicCardTitle}>Aulas Show</h3>
            <p className={styles.heroicCardText}>
              Aprenda com quem faz acontecer. Palestras com referências do mercado trazendo insights práticos para revolucionar a gestão e o lucro do seu negócio.
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
      </div>
    </section>
  );
}
