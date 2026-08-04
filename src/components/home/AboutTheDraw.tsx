import React from 'react';
import styles from './OQueEsperar.module.css';
import CustomSelect from '../CustomSelect';
import SorteioForm from './SorteioForm';
import { createClient } from '@/utils/supabase/server';

import { FiGift, FiDollarSign, FiClock } from 'react-icons/fi';

export default async function AboutTheDraw() {
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
    <section className={styles.vipSection} id="sobre2">
      <div className="container">
        <div className={styles.vipBanner}>
          <div className={styles.vipContent}>
            <h2 className={styles.vipTitle}>
              Vantagens <span>Exclusivas</span>
            </h2>
            <p className={styles.vipText}>
              Eleve o patamar do seu negócio. Preencha e concorra a prêmios, descontos e benefícios que serão sorteados durante o evento.
            </p>
            <div className={styles.vipFeatures}>
              <div className={styles.greenBoxItem}>
                <div className={styles.greenBoxIcon}><FiGift /></div> 
                <span><strong>Brindes Premium:</strong> Concorra a kits exclusivos para inscritos.</span>
              </div>
              <div className={styles.greenBoxItem}>
                <div className={styles.greenBoxIcon}><FiDollarSign /></div> 
                <span><strong>Descontos Inéditos:</strong> Ganhe tabelas de preços únicas no evento.</span>
              </div>
            </div>
          </div>
          
          <div className={styles.vipFormArea}>
            <div className={styles.mobileFormHeader}>
              <h3 className={styles.mobileFormTitle}>Participe do sorteio</h3>
              <p className={styles.mobileFormSub}>Preencha com seus dados e concorra!</p>
            </div>
            <SorteioForm tipologiaOptions={tipologiaOptions} eventId="dc845866-9b05-4141-af66-8e4e571d9fd2" />
          </div>
        </div>
      </div>
    </section>
  );
}
