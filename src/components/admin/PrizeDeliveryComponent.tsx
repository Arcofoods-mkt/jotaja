"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FiRefreshCw, FiCheckCircle, FiCircle, FiSearch } from 'react-icons/fi';
import { usePermissions } from '@/contexts/PermissionsContext';
import styles from './RankingComponent.module.css'; // Reusing ranking styles

interface Participant {
  personal_name: string;
  establishment_name: string;
  whatsapp: string;
}

interface GameResult {
  id: string;
  won: boolean;
  time_taken_seconds: number;
  prize_received: boolean;
  created_at: string;
  participants: Participant;
  game: string;
  table: string;
}

export default function PrizeDeliveryComponent() {
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameFilter, setGameFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortMode, setSortMode] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createClient();
  const { permissions, isAdmin } = usePermissions();
  const perms = isAdmin ? { ver: true, editar: true } : (permissions.Sorteios || {});

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const [memoryResponse, burgerResponse] = await Promise.all([
        supabase.from('memory_game_results').select(`
          id, won, time_taken_seconds, prize_received, created_at,
          participants (personal_name, establishment_name, whatsapp)
        `),
        supabase.from('burger_game_results').select(`
          id, won, time_taken_seconds, prize_received, created_at,
          participants (personal_name, establishment_name, whatsapp)
        `)
      ]);

      if (memoryResponse.error) throw memoryResponse.error;
      if (burgerResponse.error) throw burgerResponse.error;

      const memoryData = (memoryResponse.data || []).map((row: any) => ({
        ...row,
        participants: Array.isArray(row.participants) ? row.participants[0] : row.participants,
        game: 'Memória',
        table: 'memory_game_results'
      })) as GameResult[];

      const burgerData = (burgerResponse.data || []).map((row: any) => ({
        ...row,
        participants: Array.isArray(row.participants) ? row.participants[0] : row.participants,
        game: 'Hambúrguer',
        table: 'burger_game_results'
      })) as GameResult[];

      const allData = [...memoryData, ...burgerData];

      allData.sort((a, b) => {
        if (a.won && !b.won) return -1;
        if (!a.won && b.won) return 1;
        if (a.won && b.won) {
          return a.time_taken_seconds - b.time_taken_seconds;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setResults(allData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao carregar lista de prêmios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePrize = async (resultId: string, table: string, currentStatus: boolean) => {
    if (perms.editar === false) {
      alert("Você não tem permissão para editar prêmios.");
      return;
    }
    try {
      // Optimistic update
      setResults(prev => prev.map(r => 
        r.id === resultId ? { ...r, prize_received: !currentStatus } : r
      ));

      const { error: updateError } = await supabase
        .from(table)
        .update({ prize_received: !currentStatus })
        .eq('id', resultId);

      if (updateError) {
        throw updateError;
      }
    } catch (err: any) {
      console.error('Erro ao atualizar prêmio:', err);
      alert('Erro ao atualizar o status do prêmio.');
      // Revert optimistic update
      fetchResults();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && results.length === 0) {
    return <div className={styles.loadingBox}>Carregando prêmios...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorBox}>
        <p style={{ color: '#ff4d4f', marginBottom: '1rem' }}>{error}</p>
        <button onClick={fetchResults} className="btn-primary">Tentar Novamente</button>
      </div>
    );
  }

  const getFilteredAndSortedResults = () => {
    let filtered = [...results];

    if (gameFilter === 'memory') {
      filtered = filtered.filter(r => r.game === 'Memória');
    } else if (gameFilter === 'burger') {
      filtered = filtered.filter(r => r.game === 'Hambúrguer');
    }

    if (statusFilter === 'won') {
      filtered = filtered.filter(r => r.won);
    } else if (statusFilter === 'lost') {
      filtered = filtered.filter(r => !r.won);
    }

    if (searchTerm.trim()) {
      const lowerQuery = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        (r.participants?.personal_name || '').toLowerCase().includes(lowerQuery) ||
        (r.participants?.whatsapp || '').toLowerCase().includes(lowerQuery)
      );
    }

    if (sortMode === 'date') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      filtered.sort((a, b) => {
        if (a.won && !b.won) return -1;
        if (!a.won && b.won) return 1;
        if (a.won && b.won) {
          return a.time_taken_seconds - b.time_taken_seconds;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    return filtered;
  };

  const filteredResults = getFilteredAndSortedResults();
  let rankPosition = 0;

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Entrega de Prêmios (Unificado)</h2>
        <button className={styles.refreshButton} onClick={fetchResults} title="Atualizar">
          <FiRefreshCw /> Atualizar
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flex: '1', minWidth: '250px' }}>
          <input 
            type="text" 
            placeholder="Buscar por nome ou WhatsApp..." 
            className="input-field" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ flex: 1, margin: 0 }}
          />
        </div>
        
        <select 
          className="input-field" 
          value={gameFilter} 
          onChange={(e) => setGameFilter(e.target.value)} 
          style={{ width: 'auto', minWidth: '200px', margin: 0 }}
        >
          <option value="all">Todos os Jogos</option>
          <option value="burger">Jogo do Hambúrguer</option>
          <option value="memory">Jogo da Memória</option>
        </select>
        
        <select 
          className="input-field" 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          style={{ width: 'auto', minWidth: '200px', margin: 0 }}
        >
          <option value="all">Todos os Resultados</option>
          <option value="won">Apenas Vencedores</option>
          <option value="lost">Apenas Perdedores</option>
        </select>
        
        <select 
          className="input-field" 
          value={sortMode} 
          onChange={(e) => setSortMode(e.target.value)} 
          style={{ width: 'auto', minWidth: '200px', margin: 0 }}
        >
          <option value="rank">Por colocação no rank</option>
          <option value="date">Hora da Partida (Resultado)</option>
        </select>
      </div>

      {filteredResults.length === 0 ? (
        <div className={styles.emptyBox}>Nenhum resultado encontrado.</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Posição</th>
                <th>Jogador</th>
                <th>Jogo</th>
                <th>Status</th>
                <th>Tempo</th>
                <th>Data</th>
                <th>Entrega do Brinde</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => {
                if (result.won) rankPosition++;
                return (
                  <tr key={result.id}>
                    <td>
                      {result.won ? (
                        <strong style={{ color: rankPosition <= 5 ? 'var(--accent-color)' : 'inherit' }}>
                          {rankPosition}º
                        </strong>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{result.participants?.personal_name || 'Desconhecido'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{result.participants?.whatsapp || ''}</div>
                    </td>
                    <td>
                      <span style={{ 
                        background: result.game === 'Memória' ? 'rgba(36, 122, 216, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                        color: result.game === 'Memória' ? '#247AD8' : '#FFA500',
                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600
                      }}>
                        {result.game}
                      </span>
                    </td>
                    <td>
                      {result.won ? (
                        <span className={`${styles.statusBadge} ${styles.statusWon}`}>Venceu</span>
                      ) : (
                        <span className={`${styles.statusBadge} ${styles.statusLost}`}>Não Ganhou</span>
                      )}
                    </td>
                    <td style={{ fontWeight: result.won ? 600 : 400 }}>
                      {result.won ? formatTime(result.time_taken_seconds) : '-'}
                    </td>
                    <td style={{ fontSize: '0.9rem' }}>{formatDate(result.created_at)}</td>
                    <td>
                      <button
                        className={`${styles.prizeButton} ${result.prize_received ? styles.delivered : ''}`}
                        onClick={() => togglePrize(result.id, result.table, result.prize_received || false)}
                        disabled={!result.won || perms.editar === false}
                        title={!result.won ? "Não ganhou o jogo" : (result.prize_received ? "Marcar como não entregue" : "Marcar como entregue")}
                      >
                        {result.prize_received ? (
                          <><FiCheckCircle /> Entregue</>
                        ) : (
                          <><FiCircle /> Pendente</>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
