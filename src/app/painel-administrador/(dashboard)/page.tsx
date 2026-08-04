"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './Dashboard.module.css';
import { FiUsers, FiBriefcase, FiGift, FiAward, FiStar, FiClock } from 'react-icons/fi';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';

export default function DashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // trigger on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // KPIs
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [uniqueCompanies, setUniqueCompanies] = useState(0);
  const [totalDraws, setTotalDraws] = useState(0);
  const [uniqueWinners, setUniqueWinners] = useState(0);
  
  // Charts Data
  const [tipologiaData, setTipologiaData] = useState<any[]>([]);
  const [eventoData, setEventoData] = useState<any[]>([]);
  const [tagData, setTagData] = useState<any[]>([]);
  
  // Recent Lists
  const [recentWinners, setRecentWinners] = useState<any[]>([]);
  const [recentParticipants, setRecentParticipants] = useState<any[]>([]);

  // Colors for charts
  const COLORS = ['#94c41c', '#2c3e50', '#8e44ad', '#e74c3c', '#f39c12', '#1abc9c', '#3498db'];

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      // 1. Fetch all participants and categories
      const { data: pData } = await supabase.from('participants').select('*, category:categories!participants_category_id_fkey(*), tag:categories!participants_tag_id_fkey(*), event:categories!participants_event_id_fkey(*)');
      const { data: categories } = await supabase.from('categories').select('*');
      
      // 2. Fetch all draws and winners
      const { data: dData } = await supabase.from('draws').select('*');
      const { data: wData } = await supabase.from('draw_winners').select('*').order('created_at', { ascending: false });

      if (pData && wData && dData && categories) {
        // --- KPIs ---
        setTotalParticipants(pData.length);
        
        const companies = new Set(pData.map(p => p.cnpj).filter(Boolean));
        setUniqueCompanies(companies.size);
        
        setTotalDraws(dData.length);
        
        const winners = new Set(wData.map(w => w.participant_id));
        setUniqueWinners(winners.size);

        // --- Tipologia Data ---
        const tipologiasCount: Record<string, { count: number, color: string }> = {};
        pData.forEach(p => {
          if (p.category && p.category.type === 'tipologia') {
            const name = p.category.name;
            const color = p.category.color || '#94c41c';
            if (!tipologiasCount[name]) tipologiasCount[name] = { count: 0, color };
            tipologiasCount[name].count += 1;
          }
        });
        const tipologiaChart = Object.keys(tipologiasCount).map(name => ({
          name,
          value: tipologiasCount[name].count,
          color: tipologiasCount[name].color
        }));
        setTipologiaData(tipologiaChart);

        // --- Evento Data ---
        const eventoCount: Record<string, { count: number, color: string }> = {};
        pData.forEach(p => {
          if (p.event && p.event.type === 'evento') {
            const name = p.event.name;
            const color = p.event.color || '#3498db';
            if (!eventoCount[name]) eventoCount[name] = { count: 0, color };
            eventoCount[name].count += 1;
          }
        });
        const eventoChart = Object.keys(eventoCount).map(name => ({
          name,
          value: eventoCount[name].count,
          color: eventoCount[name].color
        }));
        setEventoData(eventoChart);

        // --- Tag Data ---
        const tagsCount: Record<string, { count: number, color: string }> = {};
        pData.forEach(p => {
          if (p.tag && p.tag.type === 'tag') {
            const name = p.tag.name;
            const color = p.tag.color || '#94c41c';
            if (!tagsCount[name]) tagsCount[name] = { count: 0, color };
            tagsCount[name].count += 1;
          }
        });
        const tagChart = Object.keys(tagsCount).map(name => ({
          name,
          Quantidade: tagsCount[name].count,
          color: tagsCount[name].color
        })).sort((a, b) => b.Quantidade - a.Quantidade).slice(0, 5); // top 5 tags
        setTagData(tagChart);

        // --- Recent Winners ---
        const recentW = wData.slice(0, 5).map(w => {
          const participant = pData.find(p => p.id === w.participant_id);
          return {
            ...w,
            participant
          };
        }).filter(w => w.participant);
        setRecentWinners(recentW);

        // --- Recent Participants ---
        const recentP = [...pData]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setRecentParticipants(recentP);
      }

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className={styles.loadingState}>Carregando painel analítico...</div>;
  }

  return (
    <div className={styles.container}>
      {/* KPIs */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <FiUsers className={styles.kpiIcon} />
            <span>Total de Leads</span>
          </div>
          <div className={styles.kpiValue}>{totalParticipants}</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <FiBriefcase className={styles.kpiIcon} />
            <span>Empresas Únicas</span>
          </div>
          <div className={styles.kpiValue}>{uniqueCompanies}</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <FiGift className={styles.kpiIcon} />
            <span>Sorteios Realizados</span>
          </div>
          <div className={styles.kpiValue}>{totalDraws}</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <FiAward className={styles.kpiIcon} />
            <span>Vencedores Únicos</span>
          </div>
          <div className={styles.kpiValue}>{uniqueWinners}</div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Distribuição por Tipologia</div>
          <div className={styles.chartContainer}>
            {tipologiaData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tipologiaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 50 : 70}
                    outerRadius={isMobile ? 80 : 100}
                    paddingAngle={5}
                    dataKey="value"
                    label={isMobile ? false : ({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    stroke="none"
                  >
                    {tipologiaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'rgba(4, 16, 29, 0.9)', border: '1px solid var(--accent-color)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  {isMobile && <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '20px' }} formatter={(value) => <span style={{ color: 'var(--text-color)' }}>{value}</span>} />}
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Nenhuma tipologia atribuída
              </div>
            )}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Distribuição por Evento</div>
          <div className={styles.chartContainer}>
            {eventoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 50 : 70}
                    outerRadius={isMobile ? 80 : 100}
                    paddingAngle={5}
                    dataKey="value"
                    label={isMobile ? false : ({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    stroke="none"
                  >
                    {eventoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'rgba(4, 16, 29, 0.9)', border: '1px solid var(--accent-color)', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  {isMobile && <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '20px' }} formatter={(value) => <span style={{ color: 'var(--text-color)' }}>{value}</span>} />}
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Nenhum evento atribuído
              </div>
            )}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>Top 5 Tags Mais Usadas</div>
          <div className={styles.chartContainer}>
            {tagData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tagData} layout="vertical" margin={{ top: 5, right: isMobile ? 10 : 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: isMobile ? 11 : 14 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: 'var(--text-color)', fontSize: isMobile ? 11 : 14 }} 
                    width={isMobile ? 90 : 120} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ background: 'rgba(4, 16, 29, 0.9)', border: '1px solid var(--accent-color)', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="Quantidade" radius={[0, 4, 4, 0]} barSize={isMobile ? 20 : 30}>
                    {tagData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Nenhuma tag atribuída
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.listsGrid}>
        <div className={styles.listCard}>
          <div className={styles.listTitle}>
            <FiStar className={styles.listTitleIcon} />
            Hall da Fama (Últimos Ganhadores)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentWinners.length > 0 ? (
              recentWinners.map((w, i) => (
                <div key={i} className={styles.listItem}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{w.participant.personal_name}</div>
                    <div className={styles.itemSub}>{w.participant.establishment_name}</div>
                  </div>
                  <div className={styles.itemMeta}>
                    {new Date(w.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Nenhum sorteio realizado ainda.</div>
            )}
          </div>
        </div>

        <div className={styles.listCard}>
          <div className={styles.listTitle}>
            <FiClock className={styles.listTitleIcon} />
            Últimas Inscrições
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentParticipants.length > 0 ? (
              recentParticipants.map((p, i) => (
                <div key={i} className={styles.listItem}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{p.personal_name}</div>
                    <div className={styles.itemSub}>{p.establishment_name}</div>
                  </div>
                  <div className={styles.itemMeta}>
                    {new Date(p.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Nenhum participante registrado.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
