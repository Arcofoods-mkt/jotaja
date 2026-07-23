"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Topbar.module.css';

export default function Topbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Impede rolagem da página quando o menu mobile está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className={styles.topbar}>
        <div className={`container ${styles.topbarContainer}`}>
          <div className={styles.logoGroup}>
            <Image src="/Imagens/arcowsvg.svg" alt="Arcofoods Logo" width={200} height={55} className={styles.logoImg} unoptimized />
            <div className={styles.logoDivider}></div>
            <Image src="/Imagens/jotajasummit.svg" alt="JotaJá Summit Logo" width={200} height={45} className={styles.logoImgSecondary} unoptimized />
          </div>

          {/* Navegação Desktop */}
          <nav className={styles.desktopNav}>
            <div className={styles.navLinks}>
              <a href="#sobre" className={styles.navLink}>Sobre nós</a>
              <a href="#parceiros" className={styles.navLink}>Parceiros</a>
              <a href="#contatos" className={styles.navLink}>Contatos</a>
            </div>
            <button type="button" className={`btn-primary ${styles.navButton}`}>
              INSCREVA-SE AGORA
            </button>
          </nav>

          {/* Botão Hambúrguer Mobile */}
          <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Abrir menu">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Fundo escuro (Overlay) Mobile */}
      {isOpen && (
        <div className={styles.menuOverlay} onClick={closeMenu}></div>
      )}

      {/* Menu Lateral Mobile */}
      <div className={`${styles.mobileSidebar} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeBtn} onClick={closeMenu} aria-label="Fechar menu">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className={styles.mobileNavLinks}>
          <a href="#sobre" className={styles.navLink} onClick={closeMenu}>Sobre nós</a>
          <a href="#parceiros" className={styles.navLink} onClick={closeMenu}>Parceiros</a>
          <a href="#contatos" className={styles.navLink} onClick={closeMenu}>Contatos</a>
          <button type="button" className={`btn-primary ${styles.mobileNavBtn}`} onClick={closeMenu}>
            INSCREVA-SE AGORA
          </button>
        </div>
      </div>
    </>
  );
}
