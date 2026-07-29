import React from 'react';
import styles from './AulasShow.module.css';
import { FiUser } from 'react-icons/fi';

const speakers = [
  { id: 1, name: 'Nome do Palestrante', company: 'Empresa do Palestrante', time: '10:00 - 11:00' },
  { id: 2, name: 'Nome do Palestrante', company: 'Empresa do Palestrante', time: '11:30 - 12:30' },
  { id: 3, name: 'Nome do Palestrante', company: 'Empresa do Palestrante', time: '14:00 - 15:00' },
  { id: 4, name: 'Nome do Palestrante', company: 'Empresa do Palestrante', time: '15:30 - 16:30' },
  { id: 5, name: 'Nome do Palestrante', company: 'Empresa do Palestrante', time: '17:00 - 18:00' },
  { id: 6, name: 'Nome do Palestrante', company: 'Empresa do Palestrante', time: '18:30 - 19:30' },
];

export default function AulasShow() {
  return (
    <section className={styles.aulasSection} id="aulas-show">
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Aulas Show</h2>
          <h3 className={styles.subtitle}>Conheça nossos palestrantes</h3>
        </div>

        <div className={styles.grid}>
          {speakers.map((speaker) => (
            <div key={speaker.id} className={styles.speakerCard}>
              <div className={styles.imagePlaceholder}>
                <FiUser className={styles.placeholderIcon} />
                {/* Quando houver foto, use a tag Image do Next.js aqui */}
              </div>
              <div className={styles.speakerName}>{speaker.name}</div>
              <div className={styles.speakerCompany}>{speaker.company}</div>
              <div className={styles.timeTag}>{speaker.time}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
