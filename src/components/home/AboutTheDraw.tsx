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
              Eleve o patamar do seu negócio. Preencha seu passe VIP e concorra a prêmios, descontos surpreendentes e benefícios exclusivos que serão sorteados durante o evento.
            </p>
            <div className={styles.vipFeatures}>
              <div className={styles.greenBoxItem}>
                <div className={styles.greenBoxIcon}><FiGift /></div> 
                <span><strong>Brindes Premium:</strong> Concorra a kits especiais sorteados apenas entre os inscritos.</span>
              </div>
              <div className={styles.greenBoxItem}>
                <div className={styles.greenBoxIcon}><FiDollarSign /></div> 
                <span><strong>Descontos Inéditos:</strong> Tenha a chance de ganhar tabelas de preços únicas reveladas no evento.</span>
              </div>
            </div>
          </div>
          
          <div className={styles.vipFormArea}>
            <SorteioForm tipologiaOptions={tipologiaOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
