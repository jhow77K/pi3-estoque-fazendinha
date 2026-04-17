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
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Histórico de Movimentações</h2>
        <button onClick={onVoltar} style={{ padding: '8px 12px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Voltar ao Dashboard
        </button>
      </div>

      {erro && <p style={{ color: 'red', fontWeight: 'bold' }}>{erro}</p>}

      <table border={1} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: '#fff' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th style={{ padding: '12px' }}>Data e Hora</th>
            <th>Tipo</th>
            <th>Produto</th>
            <th>Qtd Movimentada</th>
            <th style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>Estoque Atual</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.length > 0 ? (
            movimentacoes.map((mov) => (
              <tr key={mov.id}>
                <td style={{ padding: '10px', color: '#555' }}>{formatarData(mov.data_hora)}</td>
                <td style={{ 
                  fontWeight: 'bold', 
                  color: mov.tipo === 'ENTRADA' ? '#2e7d32' : '#c62828' 
                }}>
                  {mov.tipo === 'ENTRADA' ? 'ENTRADA' : 'SAÍDA'}
                </td>
                <td style={{ fontWeight: 'bold' }}>{mov.produto_nome}</td>
                <td>{mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.quantidade} un.</td>
                <td style={{ fontWeight: 'bold', backgroundColor: '#f3e5f5', color: mov.saldo_atual < 5 ? '#d32f2f' : '#4a148c' }}>
                  {mov.saldo_atual} un.
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ padding: '20px', color: '#666' }}>
                Nenhuma movimentação registrada ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}