import React from 'react';
import styles from './Footer.module.css';
import { TbBrandInstagram, TbBrandWhatsapp, TbBrandLinkedin } from 'react-icons/tb';

export default function Footer() {
  return (
    <footer className={styles.footer} id="contatos">
      <div className={`container ${styles.footerContainer}`}>
        {/* Coluna da Esquerda: Logo e Frase */}
        <div className={styles.brandColumn}>
          <img src="/Imagens/arcowsvg.svg" alt="Arcofoods" className={styles.footerLogo} />
          <p className={styles.description}>
            O evento que vai revolucionar o seu negócio. Não fique de fora dessa imersão.
          </p>
        </div>

        {/* Coluna do Meio: Redes Sociais */}
        <div className={styles.socialColumn}>
          <h3 className={styles.socialTitle}>Redes Sociais</h3>
          <div className={styles.socialLinks}>
            <a href="https://instagram.com/arcofoods" target="_blank" rel="noopener noreferrer">
              <TbBrandInstagram className={styles.icon} />
              @arcofoods
            </a>
            <a href="https://wa.me/5521972416096?text=Ol%C3%A1!%20Vim%20pelo%20site%20do%20JOTAJ%C3%81%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer">
              <TbBrandWhatsapp className={styles.icon} />
              21 97241-6096
            </a>
            <a href="https://www.linkedin.com/company/arcofoods-arco-sul-distribuidora-de-alimentos-/" target="_blank" rel="noopener noreferrer">
              <TbBrandLinkedin className={styles.icon} />
              Arcofoods
            </a>
          </div>
        </div>

        {/* Coluna da Direita: GPTW Logo */}
        <div className={styles.gptwColumn}>
          <a href="https://certificadas.gptw.com.br/08365731000142" target="_blank" rel="noopener noreferrer">
            <img src="/Imagens/GPTWlogo.svg" alt="Great Place to Work" className={styles.gptwLogo} />
          </a>
        </div>
      </div>
      
      <div className={styles.copyrightBar}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Arcofoods. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
