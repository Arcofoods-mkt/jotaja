"use client";

import React, { useState, useEffect } from 'react';

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
      <header className="topbar container">
        <img src="/imagens/arcowsvg.svg" alt="Arcofoods Logo" className="logo-img" />
        
        {/* Navegação Desktop */}
        <nav className="desktop-nav">
          <div className="nav-links">
            <a href="#sobre" className="nav-link">Sobre nós</a>
            <a href="#parceiros" className="nav-link">Parceiros</a>
            <a href="#contatos" className="nav-link">Contatos</a>
          </div>
          <button type="button" className="btn-primary" style={{ margin: 0, padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
            INSCREVA-SE AGORA
          </button>
        </nav>

        {/* Botão Hambúrguer Mobile */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Abrir menu">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </header>

      {/* Fundo escuro (Overlay) Mobile */}
      {isOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}

      {/* Menu Lateral Mobile */}
      <div className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={closeMenu} aria-label="Fechar menu">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="mobile-nav-links">
          <a href="#sobre" className="nav-link" onClick={closeMenu}>Sobre nós</a>
          <a href="#parceiros" className="nav-link" onClick={closeMenu}>Parceiros</a>
          <a href="#contatos" className="nav-link" onClick={closeMenu}>Contatos</a>
          <button type="button" className="btn-primary" style={{ marginTop: '2rem' }} onClick={closeMenu}>
            INSCREVA-SE AGORA
          </button>
        </div>
      </div>
    </>
  );
}
