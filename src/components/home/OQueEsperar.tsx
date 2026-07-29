import React from 'react';
import Image from 'next/image';
import styles from './OQueEsperar.module.css';
import { FiLayers, FiStar, FiGift } from 'react-icons/fi';
import { LuChefHat } from 'react-icons/lu';

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
            <div className={styles.heroicIcon}><FiLayers /></div>
            <h3 className={styles.heroicCardTitle}>Novas Categorias</h3>
            <p className={styles.heroicCardText}>
              Descubra em primeira mão lançamentos exclusivos e um portfólio expandido, pensado estrategicamente para elevar o padrão do seu menu e encantar seus clientes.
            </p>
          </div>
          
          <div className={styles.heroicCard}>
            <div className={styles.heroicIcon}><FiStar /></div>
            <h3 className={styles.heroicCardTitle}>Chef</h3>
            <p className={styles.heroicCardText}>
              Uma experiência gastronômica guiada por uma verdadeira estrela da alta culinária. Venha aprender de perto com quem conquistou os holofotes no maior reality show de gastronomia do mundo!
            </p>
          </div>

          <div className={styles.heroicCard}>
            <div className={styles.heroicIcon}><LuChefHat /></div>
            <h3 className={styles.heroicCardTitle}>Aulas Show</h3>
            <p className={styles.heroicCardText}>
              Aprenda com palestrantes que são referência absoluta no mercado. Insights práticos e inovações que vão alavancar a gestão e o faturamento do seu estabelecimento.
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
