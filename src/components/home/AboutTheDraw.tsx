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
    <section className={styles.drawSection} id="sobre2">
      <div className={`container ${styles.aboutGrid}`}>
        <div className={styles.aboutContent}>
          <h2 className={styles.drawTitle}>
            CONCORRA A <span>PRÊMIOS INCRÍVEIS</span>
          </h2>
          <p className={styles.text}>
            Quer levar vantagens reais para o seu negócio? Você pode garantir <strong>brindes exclusivos e super descontos</strong> preenchendo o cadastro ao lado.
          </p>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}><FiGift /></span> 
              <span><strong>Brindes Exclusivos:</strong> Kits especiais sorteados apenas para quem se inscrever</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}><FiDollarSign /></span> 
              <span><strong>Descontos Especiais:</strong> Condições únicas de compra para os ganhadores</span>
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
