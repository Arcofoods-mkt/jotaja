import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="contatos">
      <div className="container">
        <h2>JotaJá Summit 2026</h2>
        <p className={styles.description}>
          O evento que vai revolucionar o seu negócio. Não fique de fora dessa imersão.
        </p>
        <div className={styles.socialLinks}>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">WhatsApp</a>
        </div>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} JotaJá Summit. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
