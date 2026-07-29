import React from 'react';
import styles from './AboutSection.module.css';
import CustomSelect from '../CustomSelect';
import SorteioForm from './SorteioForm';
import { createClient } from '@/utils/supabase/server';

export default async function AboutSection() {
  const supabase = await createClient();
  const { data: tipologias } = await supabase
    .from('categories')
    .select('id, name')
    .eq('type', 'tipologia')
    .order('name', { ascending: true });

  const tipologiaOptions = tipologias?.map(t => ({
    value: t.id,
    label: t.name
  })) || [];

  return (
    <section className={styles.aboutSection} id="sobre">
      <div className={`container ${styles.aboutGrid}`}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutTitleBox}>
            <h2 className={styles.aboutTitleText}>
              O QUE ESPERAR DE 2026
            </h2>
          </div>
          <p className={styles.text}>
            O JotaJá Summit já se consolidou como o maior ponto de encontro para quem quer acelerar os negócios. No ano passado, lotamos os auditórios e geramos milhões em negócios fechados.
          </p>
          <p className={styles.text}>
            Nesta nova edição, teremos palestras exclusivas, oportunidades de networking inigualáveis e muito mais. Prepare-se para elevar sua empresa de patamar.
          </p>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Muito Networking
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Rodadas de Negócios
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span> Inovações do Varejo
            </li>
          </ul>
        </div>
        
        <div className={styles.formWrapper}>
          <div className={`glass ${styles.formBox}`}>
            <SorteioForm tipologiaOptions={tipologiaOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
