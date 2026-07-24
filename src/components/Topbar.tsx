"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Topbar.module.css';
import { TbHourglass } from 'react-icons/tb';

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

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      closeMenu(); // fecha o menu mobile se estiver aberto
    }
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetDate = new Date('2026-08-18T09:00:00-03:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className={styles.countdownBar}>
        <div className="container" style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}>
          {isMounted ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <TbHourglass size={20} />
              <span>Faltam</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <span className={styles.timeSquare}>{String(timeLeft.days).padStart(2, '0')}</span><span className={styles.timeLabel}>d</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <span className={styles.timeSquare}>{String(timeLeft.hours).padStart(2, '0')}</span><span className={styles.timeLabel}>h</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <span className={styles.timeSquare}>{String(timeLeft.minutes).padStart(2, '0')}</span><span className={styles.timeLabel}>m</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <span className={styles.timeSquare}>{String(timeLeft.seconds).padStart(2, '0')}</span><span className={styles.timeLabel}>s</span>
              </div>
              
              <span>para o evento!</span>
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
              <TbHourglass size={20} />
              Carregando tempo restante...
            </span>
          )}
        </div>
      </div>
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
              <a href="#sobre-arcofoods" className={styles.navLink} onClick={(e) => handleScroll(e, 'sobre-arcofoods')}>Sobre nós</a>
              <a href="#parceiros" className={styles.navLink} onClick={(e) => handleScroll(e, 'parceiros')}>Parceiros</a>
              <a href="#contatos" className={styles.navLink} onClick={(e) => handleScroll(e, 'contatos')}>Contatos</a>
            </div>
            {false && (
              <button type="button" className={`btn-primary ${styles.navButton}`}>
                INSCREVA-SE AGORA
              </button>
            )}
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
          <a href="#sobre-arcofoods" className={styles.navLink} onClick={(e) => handleScroll(e, 'sobre-arcofoods')}>Sobre nós</a>
          <a href="#parceiros" className={styles.navLink} onClick={(e) => handleScroll(e, 'parceiros')}>Parceiros</a>
          <a href="#contatos" className={styles.navLink} onClick={(e) => handleScroll(e, 'contatos')}>Contatos</a>
          {false && (
            <button type="button" className={`btn-primary ${styles.mobileNavBtn}`} onClick={closeMenu}>
              INSCREVA-SE AGORA
            </button>
          )}
        </div>
      </div>
    </>
  );
}
