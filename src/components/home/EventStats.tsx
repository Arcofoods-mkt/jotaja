"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './EventStats.module.css';

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp: number | null = null;
          
          const easeOutExpo = (x: number): number => {
            return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
          };

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const easedProgress = easeOutExpo(progress);
            setCount(Math.floor(easedProgress * end));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 } // start animation when 30% of the element is visible
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return { count, ref };
}

function StatItem({ end, suffix = "", label }: { end: number, suffix?: string, label: string }) {
  const { count, ref } = useCountUp(end, 2500);
  const formattedCount = count.toLocaleString('pt-BR');

  return (
    <div className={styles.statCard} ref={ref}>
      <div className={styles.statNumber}>
        {formattedCount}{suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function EventStats() {
  return (
    <section className={`container ${styles.statsSection}`}>
      <h2 className={styles.statsTitle}>
        A SUA VIRADA COMEÇA AQUI!
      </h2>
      <p className={styles.statsSubtitle}>
        DA TEORIA À PRÁTICA, O EVENTO QUE MUDA O JOGO.
      </p>

      <div className={styles.statsGrid}>
        <StatItem end={3000} label="PARTICIPANTES" />
        <StatItem end={70} suffix="+" label="STANDS" />
        <StatItem end={2} suffix=" DIAS" label="DE IMERSÃO" />
      </div>
    </section>
  );
}
