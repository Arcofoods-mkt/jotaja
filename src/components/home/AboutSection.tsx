import React from 'react';
import styles from './AboutSection.module.css';
import CustomSelect from '../CustomSelect';
import SorteioForm from './SorteioForm';
import { createClient } from '@/utils/supabase/server';

import { FiZap, FiTrendingUp, FiAward } from 'react-icons/fi';

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
              A REVOLUÇÃO DO FOOD SERVICE
            </h2>
          </div>
          <p className={styles.text}>
            Esqueça tudo o que você sabe sobre distribuição e parcerias estratégicas. No <strong>JotaJá Summit 2026</strong>, a Arcofoods não vai apenas expor produtos, nós vamos abrir as portas para o futuro do seu negócio.
          </p>
          <p className={styles.text}>
            Preparamos uma experiência imersiva e altamente tecnológica no nosso stand. É a chance de conectar sua empresa com inovações que vão ditar as regras do mercado nas próximas décadas. Venha viver a experiência!
          </p>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}><FiZap /></span> 
              <span><strong>Ecossistema Inovador:</strong> Soluções para acelerar sua operação</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}><FiTrendingUp /></span> 
              <span><strong>Rodadas Estratégicas:</strong> Conexões que geram resultados imediatos</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}><FiAward /></span> 
              <span><strong>Condições Exclusivas:</strong> Condições jamais vistas para parceiros no Summit</span>
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
