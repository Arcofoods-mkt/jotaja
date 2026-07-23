import React from 'react';
import Topbar from '../Topbar';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.heroBg}>
      <Topbar />
      <div className={`container ${styles.hero}`}>
        <div className={styles.heroContent}>
          <h1>
            Venha visitar a <br />
            <span className={`text-gradient font-display ${styles.highlightText}`}>nossa cozinha!</span>
          </h1>
          <p className={styles.description}>
            Conecte-se com as maiores indústrias, descubra inovações do mercado e transforme seus resultados em 2 dias de imersão total.
          </p>

          <div className={styles.advantagesBox}>
            <h4 className={styles.advantagesTitle}>Por que se inscrever agora?</h4>
            <div className={styles.advantageItem}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span className={styles.advantageText}><strong>Ganhe 5% OFF</strong> na sua próxima compra Arcofoods</span>
            </div>
            <div className={styles.advantageItem}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span className={styles.advantageText}>Participe de <strong>sorteios exclusivos</strong> durante os 2 dias de evento</span>
            </div>
          </div>
        </div>

        <div className={styles.heroFormWrapper}>
          <div className={`glass ${styles.formBox}`}>
            <h3>Cadastrou, ganhou!</h3>
            <p className={styles.formSubtitle}>Preencha os dados abaixo e receba 5% de desconto na sua próxima compra.</p>

            <form className={styles.form}>
              <input type="text" placeholder="Nome Pessoal" className="input-field" required />
              <input type="text" placeholder="Nome do Estabelecimento" className="input-field" required />
              <input type="text" placeholder="CNPJ" className="input-field" required />
              <input type="email" placeholder="E-mail" className="input-field" required />
              <input type="tel" placeholder="WhatsApp" className="input-field" required />

              <select className="input-field" required defaultValue="">
                <option value="" disabled>Selecione a Tipologia</option>
                <option value="varejo">Varejo</option>
                <option value="atacado">Atacado</option>
                <option value="industria">Indústria</option>
                <option value="outro">Outro</option>
              </select>

              <button type="button" className="btn-primary">
                Quero meu Desconto e Convite
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
