import React from 'react';
import Image from 'next/image';
import Topbar from '../../components/Topbar';
import CustomSelect from '../../components/CustomSelect';
import Footer from '../../components/Footer';
import styles from './page.module.css';

export default function SorteioPage() {
  return (
    <main className={styles.pageContainer}>
      <Image
        src="/Imagens/hero.webp"
        alt="JotaJá Summit Background"
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
      />
      <div className={styles.overlay} />
      
      <div style={{ position: 'relative', zIndex: 3 }}>
        <Topbar />
      </div>

      <div className={styles.content}>
        <div className={styles.formWrapper}>
          <div className={`glass ${styles.formBox}`}>
            <h3>Garanta sua participação!</h3>
            <p className={styles.formSubtitle}>Preencha os dados abaixo para garantir sua participação no sorteio da Arcofoods no Jotajá Summit!</p>

            <form className={styles.form}>
              <input type="text" placeholder="Nome Pessoal" className="input-field" required />
              <input type="text" placeholder="Nome do Estabelecimento" className="input-field" required />
              <input type="text" placeholder="CNPJ" className="input-field" required />
              <input type="email" placeholder="E-mail" className="input-field" required />
              <input type="tel" placeholder="WhatsApp" className="input-field" required />

              <CustomSelect 
                placeholder="Selecione a Tipologia"
                options={[
                  { value: 'varejo', label: 'Varejo' },
                  { value: 'atacado', label: 'Atacado' },
                  { value: 'industria', label: 'Indústria' },
                  { value: 'outro', label: 'Outro' }
                ]}
              />

              <button type="button" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                Quero meu Convite
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div style={{ position: 'relative', zIndex: 3 }}>
        <Footer />
      </div>
    </main>
  );
}
