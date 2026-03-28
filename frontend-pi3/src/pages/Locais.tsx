import { useState, useEffect, type FormEvent } from 'react';
import { listarLocais, criarLocal, atualizarLocal, excluirLocal } from '../Services/localService.ts'; 
import type { Local } from '../types/index.ts'; 

interface LocaisProps {
  onVoltar: () => void;
}

export default function Locais({ onVoltar }: LocaisProps) {
  const [nomeEstante, setNomeEstante] = useState('');
  const [qtdPrateleiras, setQtdPrateleiras] = useState<number>(1);
  const [locais, setLocais] = useState<Local[]>([]);
  const [mensagem, setMensagem] = useState('');

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nomeEditando, setNomeEditando] = useState('');
  const [qtdEditando, setQtdEditando] = useState<number>(1);

  const [atualizacaoTrigger, setAtualizacaoTrigger] = useState(0);

  useEffect(() => {
    let ativo = true; 

    const buscarLocaisDaAPI = async () => {
      try {
        const dados = await listarLocais();
        if (ativo) {
          setLocais(dados);
        }
      } catch (erro) {
        console.error('Erro ao buscar locais', erro);
      }
    };

    buscarLocaisDaAPI();

    return () => {
      ativo = false; 
    };
  }, [atualizacaoTrigger]);

  const criarEstante = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem('Salvando...');

    try {
      await criarLocal({ 
        nome: nomeEstante, 
        descricao: `Gerado via sistema`,
        quantidade_prateleiras: qtdPrateleiras 
      });

      setMensagem(`Estante "${nomeEstante}" criada!`);
      setNomeEstante('');
      setQtdPrateleiras(1);
      setAtualizacaoTrigger((prev) => prev + 1); 
    } catch (erro: any) {
      setMensagem(`Erro: ${erro.message || 'Erro de conexão.'}`);
    }
  };

  const salvarEdicao = async (id: number) => {
    try {
      await atualizarLocal(id, { 
        nome: nomeEditando, 
        quantidade_prateleiras: qtdEditando,
        descricao: 'Atualizado via sistema'
      });

      setMensagem('Estante atualizada!');
      setEditandoId(null);
      setAtualizacaoTrigger((prev) => prev + 1); 
    } catch (erro: any) {
      setMensagem(`Erro ao editar: ${erro.message || 'Erro de rede.'}`);
    }
  };

  const excluirEstante = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja apagar a estante "${nome}"?`)) return;

    try {
      await excluirLocal(id);
      
      setMensagem('Estante removida com sucesso!');
      setAtualizacaoTrigger((prev) => prev + 1); 
    } catch (erro: any) {
      setMensagem(`${erro.message || 'Erro ao tentar excluir.'}`);
    }
  };

  const iniciarEdicao = (local: Local) => {
    setEditandoId(local.id);
    setNomeEditando(local.nome);
    setQtdEditando(local.quantidade_prateleiras);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Gerenciar Estantes / Locais</h2>
        <button onClick={onVoltar} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Voltar</button>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '30px' }}>
        <form onSubmit={criarEstante}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nova Estante:</label>
              <input type="text" value={nomeEstante} onChange={(e) => setNomeEstante(e.target.value)} required placeholder="Ex: Estante A" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Prateleiras:</label>
              <input type="number" min="1" value={qtdPrateleiras} onChange={(e) => setQtdPrateleiras(Number(e.target.value))} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <button type="submit" style={{ padding: '11px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}>Criar</button>
          </div>
        </form>
      </div>

      {mensagem && (
        <div style={{ padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: mensagem.includes('Erro') || mensagem.includes('❌') ? '#ffebee' : '#e8f5e9', color: mensagem.includes('Erro') || mensagem.includes('❌') ? '#c62828' : '#2e7d32', fontWeight: 'bold', textAlign: 'center', border: '1px solid' }}>
          {mensagem}
        </div>
      )}

      <h3>Estantes Cadastradas</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#333', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Prateleiras</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {locais.map((local) => (
            <tr key={local.id} style={{ borderBottom: '1px solid #eee' }}>
              {editandoId === local.id ? (
                <>
                  <td style={{ padding: '8px' }}><input type="text" value={nomeEditando} onChange={(e) => setNomeEditando(e.target.value)} style={{ width: '90%', padding: '5px' }} /></td>
                  <td style={{ padding: '8px', textAlign: 'center' }}><input type="number" value={qtdEditando} onChange={(e) => setQtdEditando(Number(e.target.value))} style={{ width: '50px', padding: '5px' }} /></td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>
                    <button onClick={() => salvarEdicao(local.id)} style={{ marginRight: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Salvar</button>
                    <button onClick={() => setEditandoId(null)} style={{ backgroundColor: '#9e9e9e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ padding: '12px' }}>{local.nome}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{local.quantidade_prateleiras}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => iniciarEdicao(local)} style={{ marginRight: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '3px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => excluirEstante(local.id, local.nome)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '3px', cursor: 'pointer' }}>Excluir</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}