"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FiRefreshCw, FiCheckCircle, FiCircle, FiTrash2 } from 'react-icons/fi';
import { usePermissions } from '@/contexts/PermissionsContext';
import styles from './RankingComponent.module.css';

interface Participant {
  id: string;
  personal_name: string;
  establishment_name: string;
  whatsapp: string;
  email: string;
}

interface GameResult {
  id: string;
  won: boolean;
  time_taken_seconds: number;
  prize_received: boolean;
  created_at: string;
  participants: Participant;
}

export default function BurgerRankingComponent() {
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { permissions, isAdmin } = usePermissions();
  const perms = isAdmin ? { ver: true, editar: true, excluir: true } : (permissions.Sorteios || {});

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('burger_game_results')
        .select(`
          id,
          won,
          time_taken_seconds,
          prize_received,
          created_at,
          participants (
            id,
            personal_name,
            establishment_name,
            whatsapp,
            email
          )
        `)
        .order('won', { ascending: false })
        .order('time_taken_seconds', { ascending: true })
        .order('created_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      // Tipagem do Supabase às vezes retorna array em relacionamentos, vamos garantir
      const formattedData = (data || []).map((row: any) => ({
        ...row,
        participants: Array.isArray(row.participants) ? row.participants[0] : row.participants
      })) as GameResult[];

      setResults(formattedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao carregar o ranking.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePrize = async (resultId: string, currentStatus: boolean) => {
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
        .from('burger_game_results')
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

  const handleDelete = async (id: string) => {
    if (perms.excluir === false) {
      alert("Você não tem permissão para excluir resultados.");
      return;
    }
    if (!window.confirm('Tem certeza que deseja excluir este resultado? Esta ação não pode ser desfeita.')) return;
    
    try {
      const { error: deleteError } = await supabase.from('burger_game_results').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setResults(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      console.error(err);
      alert('Erro ao excluir resultado: ' + (err.message || ''));
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
    return <div className={styles.loadingBox}>Carregando ranking...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorBox}>
        <p style={{ color: '#ff4d4f', marginBottom: '1rem' }}>{error}</p>
        <button onClick={fetchResults} className="btn-primary">Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Ranking e Prêmios - Hambúrguer</h2>
        <button className={styles.refreshButton} onClick={fetchResults} title="Atualizar Ranking">
          <FiRefreshCw /> Atualizar
        </button>
      </div>

      {results.length === 0 ? (
        <div className={styles.emptyBox}>Nenhuma partida registrada ainda.</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Posição</th>
                <th>Jogador</th>
                <th>Empresa</th>
                <th>Status</th>
                <th>Tempo Gasto</th>
                <th>Data</th>
                <th>Prêmio</th>
                {perms.excluir !== false && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result.id}>
                  <td>
                    {result.won ? (
                      <strong style={{ color: index < 3 ? 'var(--accent-color)' : 'inherit' }}>
                        {index + 1}º
                      </strong>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{result.participants?.personal_name || 'Desconhecido'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{result.participants?.whatsapp || ''}</div>
                  </td>
                  <td>{result.participants?.establishment_name || '-'}</td>
                  <td>
                    {result.won ? (
                      <span className={`${styles.statusBadge} ${styles.statusWon}`}>Venceu</span>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles.statusLost}`}>Errou a Ordem</span>
                    )}
                  </td>
                  <td style={{ fontWeight: result.won ? 600 : 400 }}>
                    {formatTime(result.time_taken_seconds)}
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>{formatDate(result.created_at)}</td>
                  <td>
                    <button
                      className={`${styles.prizeButton} ${result.prize_received ? styles.delivered : ''}`}
                      onClick={() => togglePrize(result.id, result.prize_received || false)}
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
                  {perms.excluir !== false && (
                    <td>
                      <button 
                        onClick={() => handleDelete(result.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          color: '#ef4444',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Excluir Resultado"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
