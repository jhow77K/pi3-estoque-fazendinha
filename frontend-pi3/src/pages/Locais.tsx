import { useState, useEffect, type FormEvent } from 'react';
import { listarLocais, criarLocal, atualizarLocal, excluirLocal } from '../Services/localService.ts';
import { useTheme } from '../ThemeContext';
import type { Local } from '../types/index.ts';

interface LocaisProps {
  onVoltar: () => void;
}

export default function Locais({ onVoltar }: LocaisProps) {
  const { theme } = useTheme();
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

      setMensagem(`Estante "${nomeEstante}" criada com sucesso!`);
      setNomeEstante('');
      setQtdPrateleiras(1);
      setAtualizacaoTrigger((prev) => prev + 1); 
      setTimeout(() => setMensagem(''), 3000);
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
      setTimeout(() => setMensagem(''), 3000);
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
      setTimeout(() => setMensagem(''), 3000);
    } catch (erro: any) {
      setMensagem(`${erro.message || 'Erro ao tentar excluir.'}`);
    }
  };

  const iniciarEdicao = (local: Local) => {
    setEditandoId(local.id);
    setNomeEditando(local.nome);
    setQtdEditando(local.quantidade_prateleiras);
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '14px',
    border: `1px solid ${theme.primaryLight || '#e2e8f0'}`,
    padding: '12px 16px',
    fontSize: '15px',
    color: theme.textPrimary || '#1e293b',
    backgroundColor: '#fff',
    outline: 'none',
  };

  const btnPrimaryStyle: React.CSSProperties = {
    padding: '12px 20px',
    backgroundColor: theme.primary,
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'opacity 0.2s',
    width: '100%'
  };

  return (
    <>
      <style>{`
        .mobile-view { display: none; }
        .desktop-view { display: block; }
        .form-grid { display: grid; grid-template-columns: 2fr 1fr auto; gap: 16px; align-items: end; }
        
        @media (max-width: 768px) {
          .desktop-view { display: none; }
          .mobile-view { display: flex; flex-direction: column; gap: 16px; }
          .form-grid { grid-template-columns: 1fr; align-items: stretch; }
          .header-container { flex-direction: column; align-items: flex-start !important; gap: 16px; }
          .back-btn { width: 100%; text-align: center; }
          .page-wrapper { padding: 20px 16px !important; }
        }
      `}</style>

      <div className="page-wrapper" style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'inherit' }}>
        
        {/* CABEÇALHO */}
        <div className="header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: theme.textPrimary || '#0f172a', fontSize: 'clamp(24px, 5vw, 28px)' }}>
              Gerenciar Estantes / Locais
            </h2>
            <p style={{ margin: 0, color: theme.textSecondary || '#64748b', fontSize: '15px' }}>
              Adicione, edite ou remova os locais de armazenamento do seu estoque.
            </p>
          </div>
          <button 
            className="back-btn"
            onClick={onVoltar} 
            style={{ padding: '10px 16px', cursor: 'pointer', backgroundColor: 'transparent', color: theme.textSecondary || '#64748b', border: `1px solid ${theme.primaryLight || '#e2e8f0'}`, borderRadius: '14px', fontWeight: 600, fontSize: '14px' }}
          >
            ← Voltar ao painel
          </button>
        </div>

        {mensagem && (
          <div style={{ padding: '16px', marginBottom: '24px', borderRadius: '14px', backgroundColor: mensagem.includes('Erro') ? '#fef2f2' : '#ecfdf5', color: mensagem.includes('Erro') ? '#dc2626' : '#059669', border: `1px solid ${mensagem.includes('Erro') ? '#fecaca' : '#bbf7d0'}`, fontSize: '15px', fontWeight: 500 }}>
            {mensagem}
          </div>
        )}

        {/* FORMULÁRIO DE CRIAÇÃO */}
        <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '24px', border: `1px solid ${theme.primaryLight || '#e2e8f0'}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '32px' }}>
          <form onSubmit={criarEstante}>
            <div className="form-grid">
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: theme.textPrimary || '#334155' }}>
                  Nome da Nova Estante
                </label>
                <input type="text" value={nomeEstante} onChange={(e) => setNomeEstante(e.target.value)} required placeholder="Ex: Estante de Adubos A" style={fieldStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: theme.textPrimary || '#334155' }}>
                  Nº de Prateleiras
                </label>
                <input type="number" min="1" value={qtdPrateleiras} onChange={(e) => setQtdPrateleiras(Number(e.target.value))} required style={fieldStyle} />
              </div>
              <button type="submit" style={btnPrimaryStyle}>
                + Criar Estante
              </button>
            </div>
          </form>
        </div>

        {/* VERSÃO MOBILE (Cards) */}
        <div className="mobile-view">
          {locais.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: theme.textSecondary || '#94a3b8', backgroundColor: '#fff', borderRadius: '20px', border: `1px solid ${theme.primaryLight || '#e2e8f0'}` }}>
              Nenhuma estante cadastrada ainda.
            </div>
          ) : (
            locais.map((local) => (
              <div key={local.id} style={{ backgroundColor: '#fff', padding: '20px', border: `1px solid ${theme.primaryLight || '#e2e8f0'}`, borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                {editandoId === local.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" value={nomeEditando} onChange={(e) => setNomeEditando(e.target.value)} style={fieldStyle} />
                    <input type="number" value={qtdEditando} onChange={(e) => setQtdEditando(Number(e.target.value))} style={fieldStyle} />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button onClick={() => salvarEdicao(local.id)} style={{ ...btnPrimaryStyle, flex: 1 }}>Salvar</button>
                      <button onClick={() => setEditandoId(null)} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '14px', fontWeight: 600 }}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <strong style={{ fontSize: '16px', color: theme.textPrimary || '#334155', display: 'block', marginBottom: '4px' }}>{local.nome}</strong>
                        <span style={{ fontSize: '13px', color: theme.textSecondary || '#64748b' }}>
                          <span style={{ fontWeight: 'bold', color: theme.primary }}>{local.quantidade_prateleiras}</span> prateleiras
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', borderTop: `1px solid ${theme.primaryLight || '#f1f5f9'}`, paddingTop: '16px' }}>
                      <button onClick={() => iniciarEdicao(local)} style={{ flex: 1, padding: '10px', backgroundColor: theme.primaryLight || '#e0f2fe', color: theme.primary, border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}>Editar</button>
                      <button onClick={() => excluirEstante(local.id, local.nome)} style={{ flex: 1, padding: '10px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}>Excluir</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* TABELA DE DADOS - DESKTOP */}
        <div className="desktop-view">
          <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: `1px solid ${theme.primaryLight || '#e2e8f0'}`, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: `1px solid ${theme.primaryLight || '#e2e8f0'}` }}>
                  <th style={{ padding: '16px 24px', color: theme.textSecondary || '#64748b', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nome do Local</th>
                  <th style={{ padding: '16px 24px', color: theme.textSecondary || '#64748b', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Prateleiras</th>
                  <th style={{ padding: '16px 24px', color: theme.textSecondary || '#64748b', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {locais.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: theme.textSecondary || '#94a3b8' }}>
                      Nenhuma estante cadastrada ainda.
                    </td>
                  </tr>
                ) : (
                  locais.map((local) => (
                    <tr key={local.id} style={{ borderBottom: `1px solid ${theme.primaryLight || '#e2e8f0'}`, transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      {editandoId === local.id ? (
                        <>
                          <td style={{ padding: '12px 24px' }}>
                            <input type="text" value={nomeEditando} onChange={(e) => setNomeEditando(e.target.value)} style={{ ...fieldStyle, padding: '8px 12px' }} />
                          </td>
                          <td style={{ padding: '12px 24px', textAlign: 'center' }}>
                            <input type="number" value={qtdEditando} onChange={(e) => setQtdEditando(Number(e.target.value))} style={{ ...fieldStyle, padding: '8px 12px', width: '80px', textAlign: 'center', margin: '0 auto' }} />
                          </td>
                          <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                            <button onClick={() => salvarEdicao(local.id)} style={{ padding: '8px 14px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', marginRight: '8px' }}>Salvar</button>
                            <button onClick={() => setEditandoId(null)} style={{ padding: '8px 14px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Cancelar</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '16px 24px', color: theme.textPrimary || '#334155', fontWeight: 500 }}>{local.nome}</td>
                          <td style={{ padding: '16px 24px', textAlign: 'center', color: theme.textSecondary || '#64748b' }}>
                            <span style={{ backgroundColor: theme.primaryLight || '#e0f2fe', color: theme.primary, padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600 }}>
                              {local.quantidade_prateleiras}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button onClick={() => iniciarEdicao(local)} style={{ padding: '8px 14px', backgroundColor: theme.primaryLight || '#e0f2fe', color: theme.primary, border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', marginRight: '8px' }}>Editar</button>
                            <button onClick={() => excluirEstante(local.id, local.nome)} style={{ padding: '8px 14px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Excluir</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}