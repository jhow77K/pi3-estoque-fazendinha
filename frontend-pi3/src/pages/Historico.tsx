import { useEffect, useState } from 'react';
import { listarHistorico } from '../Services/produtoService.ts';
import { useTheme } from '../ThemeContext';
import type { Movimentacao } from '../types/index.ts';

interface HistoricoProps {
  onVoltar: () => void;
}

export default function Historico({ onVoltar }: HistoricoProps) {
  const { theme } = useTheme(); 
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const dados = await listarHistorico();
        setMovimentacoes(dados);
      } catch (err: any) {
        setErro(err.message || 'Erro de conexão com o servidor.');
      }
    };

    carregarHistorico();
  }, []);

  const formatarData = (dataIso: string) => {
    const data = new Date(dataIso);
    return data.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      {/* Estilos para Responsividade (Mobile vs Desktop) */}
      <style>{`
        .mobile-view { display: none; }
        .desktop-view { display: block; }
        
        @media (max-width: 768px) {
          .desktop-view { display: none; }
          .mobile-view { display: flex; flex-direction: column; gap: 16px; }
          .header-container { flex-direction: column; align-items: flex-start !important; gap: 16px; }
          .back-btn { width: 100%; text-align: center; }
          .page-wrapper { padding: 20px 16px !important; }
        }
      `}</style>

      <div className="page-wrapper" style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'inherit' }}>
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: theme.textPrimary || '#0f172a', fontSize: 'clamp(24px, 5vw, 28px)' }}>
              Histórico de Movimentações
            </h2>
            <p style={{ margin: 0, color: theme.textSecondary || '#64748b', fontSize: '15px' }}>
              Acompanhe todas as entradas e saídas de produtos no seu estoque.
            </p>
          </div>
          <button 
            className="back-btn"
            onClick={onVoltar} 
            style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: 'transparent', color: theme.textSecondary || '#64748b', border: `1px solid ${theme.primaryLight || '#e2e8f0'}`, borderRadius: '14px', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ← Voltar ao painel
          </button>
        </div>

        {erro && (
          <div style={{ padding: '16px', marginBottom: '24px', borderRadius: '14px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '15px', fontWeight: 500 }}>
            {erro}
          </div>
        )}

        {/* VERSÃO MOBILE (Cards) */}
        <div className="mobile-view">
          {movimentacoes.length > 0 ? (
            movimentacoes.map((mov) => {
              const isEntrada = mov.tipo === 'ENTRADA';
              const isEstoqueBaixo = mov.saldo_atual < 5;

              return (
                <div key={mov.id} style={{ backgroundColor: '#fff', padding: '20px', border: `1px solid ${theme.primaryLight || '#e2e8f0'}`, borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  
                  {/* Linha 1: Produto e Tipo */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${theme.primaryLight || '#f1f5f9'}` }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: theme.textSecondary || '#64748b', marginBottom: '4px' }}>Produto</span>
                      <strong style={{ fontSize: '16px', color: theme.textPrimary || '#334155' }}>{mov.produto_nome}</strong>
                    </div>
                    <span style={{ 
                      backgroundColor: isEntrada ? '#dcfce7' : '#fee2e2', 
                      color: isEntrada ? '#166534' : '#991b1b', 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      fontWeight: 700,
                      letterSpacing: '0.05em'
                    }}>
                      {isEntrada ? 'ENTRADA' : 'SAÍDA'}
                    </span>
                  </div>

                  {/* Linha 2: Data e Qtd Movimentada */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: theme.textSecondary || '#64748b', marginBottom: '4px' }}>Data e Hora</span>
                      <span style={{ fontSize: '14px', color: theme.textPrimary || '#334155' }}>{formatarData(mov.data_hora)}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '12px', color: theme.textSecondary || '#64748b', marginBottom: '4px' }}>Movimentado</span>
                      <span style={{ fontSize: '15px', color: isEntrada ? '#166534' : '#991b1b', fontWeight: 700 }}>
                        {isEntrada ? '+' : '-'}{mov.quantidade} un.
                      </span>
                    </div>
                  </div>

                  {/* Linha 3: Estoque Atual */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                    <span style={{ fontSize: '13px', color: theme.textSecondary || '#64748b', fontWeight: 600 }}>Estoque Atual</span>
                    <span style={{ 
                      backgroundColor: isEstoqueBaixo ? '#fef2f2' : (theme.primaryLight || '#e0f2fe'), 
                      color: isEstoqueBaixo ? '#ef4444' : theme.primary, 
                      padding: '4px 12px', 
                      borderRadius: '999px', 
                      fontSize: '14px', 
                      fontWeight: 700 
                    }}>
                      {mov.saldo_atual} un.
                    </span>
                  </div>

                </div>
              );
            })
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: theme.textSecondary || '#94a3b8', backgroundColor: '#fff', borderRadius: '20px', border: `1px solid ${theme.primaryLight || '#e2e8f0'}` }}>
              Nenhuma movimentação registrada ainda.
            </div>
          )}
        </div>

        {/* TABELA DE DADOS - DESKTOP */}
        <div className="desktop-view">
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: `1px solid ${theme.primaryLight || '#e2e8f0'}`, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: `1px solid ${theme.primaryLight || '#e2e8f0'}` }}>
                  <th style={{ padding: '16px 24px', color: theme.textSecondary || '#64748b', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data e Hora</th>
                  <th style={{ padding: '16px 24px', color: theme.textSecondary || '#64748b', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo</th>
                  <th style={{ padding: '16px 24px', color: theme.textSecondary || '#64748b', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Produto</th>
                  <th style={{ padding: '16px 24px', color: theme.textSecondary || '#64748b', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Qtd</th>
                  <th style={{ padding: '16px 24px', color: theme.textSecondary || '#64748b', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Estoque Atual</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.length > 0 ? (
                  movimentacoes.map((mov) => {
                    const isEntrada = mov.tipo === 'ENTRADA';
                    const isEstoqueBaixo = mov.saldo_atual < 5;

                    return (
                      <tr key={mov.id} style={{ borderBottom: `1px solid ${theme.primaryLight || '#e2e8f0'}`, transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '16px 24px', color: theme.textSecondary || '#64748b', fontSize: '14px' }}>
                          {formatarData(mov.data_hora)}
                        </td>
                        
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ 
                            backgroundColor: isEntrada ? '#dcfce7' : '#fee2e2', 
                            color: isEntrada ? '#166534' : '#991b1b', 
                            padding: '4px 10px', 
                            borderRadius: '6px', 
                            fontSize: '12px', 
                            fontWeight: 700,
                            letterSpacing: '0.05em'
                          }}>
                            {isEntrada ? 'ENTRADA' : 'SAÍDA'}
                          </span>
                        </td>
                        
                        <td style={{ padding: '16px 24px', color: theme.textPrimary || '#334155', fontWeight: 500 }}>
                          {mov.produto_nome}
                        </td>
                        
                        <td style={{ padding: '16px 24px', textAlign: 'center', color: isEntrada ? '#166534' : '#991b1b', fontWeight: 600 }}>
                          {isEntrada ? '+' : '-'}{mov.quantidade}
                        </td>
                        
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          <span style={{ 
                            backgroundColor: isEstoqueBaixo ? '#fef2f2' : (theme.primaryLight || '#e0f2fe'), 
                            color: isEstoqueBaixo ? '#ef4444' : theme.primary, 
                            padding: '4px 12px', 
                            borderRadius: '999px', 
                            fontSize: '13px', 
                            fontWeight: 600 
                          }}>
                            {mov.saldo_atual} un.
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: theme.textSecondary || '#94a3b8' }}>
                      Nenhuma movimentação registrada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}