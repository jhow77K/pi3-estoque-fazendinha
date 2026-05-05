import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { listarProdutos, registrarSaida } from '../Services/produtoService.ts';
import { useTheme } from '../ThemeContext';
import type { Produto } from '../types/index.ts';

interface SaidaProps {
  onVoltar: () => void;
  onNavigate?: (page: string) => void;
}

export default function Saida({ onVoltar, onNavigate }: SaidaProps) {
  const { theme } = useTheme();
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [buscaTermo, setBuscaTermo] = useState('');
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [mensagemCamera, setMensagemCamera] = useState('');
  const [mostrarBuscaManual, setMostrarBuscaManual] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarProdutos();
    return () => { pararCamera(); };
  }, []);

  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      const dados = await listarProdutos();
      setProdutos(dados);

      if (dados.length === 0) {
        setShowModal(true);
      }
    } catch (err) {
      console.error("Erro ao carregar produtos", err);
    } finally {
      setCarregando(false);
    }
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(buscaTermo.toLowerCase()) ||
    p.codigo_barras.includes(buscaTermo)
  );

  const iniciarCamera = () => {
    setMostrarBuscaManual(false);
    setBuscaTermo('');
    setCameraAtiva(true);
    setMensagemCamera('');

    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode('leitor-camera-saida');
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (textoDecodificado) => {
            setBuscaTermo(textoDecodificado.trim());
            pararCamera();
          },
          () => {}
        );
      } catch (err: any) {
        console.error(err);
        setMensagemCamera('Erro ao acessar câmera. Verifique as permissões.');
        setCameraAtiva(false);
      }
    }, 200);
  };

  const pararCamera = () => {
    if (html5QrCodeRef.current) {
      try {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current?.clear();
          html5QrCodeRef.current = null;
        }).catch(console.error);
      } catch (err) {
        console.error('Erro ao parar câmera', err);
      }
    }
    setCameraAtiva(false);
  };

  const handleRetirada = async (produto: Produto) => {
    if (produto.quantidade_atual < 1) {
      setMensagem('❌ Este produto não tem estoque!');
      setTipoMensagem('erro');
      return;
    }

    try {
      setCarregando(true);
      await registrarSaida({
        codigo_barras: produto.codigo_barras || produto.nome,
        quantidade_saida: 1
      });

      setMensagem(`✅ ${produto.nome} - 1 un. retirada com sucesso!`);
      setTipoMensagem('sucesso');
      
      // Recarregar lista
      await carregarProdutos();
      
      setTimeout(() => setMensagem(''), 3000);
    } catch (erro: any) {
      setMensagem(`❌ Erro: ${erro.message || 'Falha ao retirar'}`);
      setTipoMensagem('erro');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      {/* Modal de aviso - Sem produtos */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '400px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 700, color: '#1c1917' }}>Nenhum Produto Cadastrado</h2>
            <p style={{ margin: '0 0 24px 0', color: '#78716c', fontSize: '14px', lineHeight: 1.6 }}>
              Não há produtos em estoque. Registre uma entrada de produtos primeiro.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button
                onClick={() => { setShowModal(false); onVoltar(); }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#e7e5df',
                  color: '#44403c',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d6d3d1'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e7e5df'}
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  onNavigate?.('entrada');
                }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Registrar Entrada
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: 'clamp(16px, 4vw, 40px)', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1200px', margin: '0 auto', backgroundColor: theme.background, minHeight: '100vh' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: theme.danger + '20', padding: '12px', borderRadius: '12px', color: theme.danger }}>
            <span style={{ fontSize: '24px' }}>➖</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(24px, 6vw, 32px)', color: '#1c1917', fontWeight: 800 }}>Registrar Saída</h1>
            <p style={{ margin: '4px 0 0 0', color: '#78716c', fontSize: 'clamp(12px, 3vw, 14px)' }}>Faça retiradas rápidas de produtos</p>
          </div>
        </div>

        {/* Mensagem de Feedback */}
        {mensagem && (
          <div style={{
            padding: '14px 16px',
            backgroundColor: tipoMensagem === 'sucesso' ? `${theme.success}1a` : `${theme.danger}1a`,
            color: tipoMensagem === 'sucesso' ? theme.success : theme.danger,
            border: `1px solid ${tipoMensagem === 'sucesso' ? theme.success : theme.danger}`,
            borderRadius: '8px',
            marginBottom: '24px',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            {mensagem}
          </div>
        )}

        {/* Câmera e Busca */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e7e5df',
          marginBottom: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#44403c' }}>
              📷 Câmera (prioritário)
            </span>
            <button
              onClick={() => cameraAtiva ? pararCamera() : iniciarCamera()}
              style={{
                padding: '8px 12px',
                backgroundColor: cameraAtiva ? theme.danger : theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px'
              }}
            >
              {cameraAtiva ? 'Fechar câmera' : 'Usar câmera'}
            </button>
          </div>

          {cameraAtiva && (
            <div style={{ marginBottom: '16px' }}>
              <div
                id="leitor-camera-saida"
                className="camera-preview"
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  aspectRatio: '1 / 1',
                  margin: '0 auto',
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: `2px solid ${theme.primary}`
                }}
              />
              {mensagemCamera && (
                <div style={{ marginTop: '10px', fontSize: '13px', color: theme.danger, fontWeight: 600 }}>{mensagemCamera}</div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: cameraAtiva ? '8px' : '0' }}>
            <button
              onClick={() => {
                setMostrarBuscaManual((prev) => {
                  const proximo = !prev;
                  if (!proximo) {
                    setBuscaTermo('');
                  }
                  return proximo;
                });
              }}
              style={{
                padding: '6px 10px',
                backgroundColor: 'transparent',
                color: theme.primary,
                border: `1px solid ${theme.primary}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              {mostrarBuscaManual ? 'Ocultar busca manual' : 'Buscar manualmente'}
            </button>
          </div>

          {mostrarBuscaManual && (
            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#44403c', marginBottom: '8px' }}>
                🔍 Busca manual (alternativa)
              </label>
              <input
                type="text"
                value={buscaTermo}
                onChange={(e) => setBuscaTermo(e.target.value)}
                placeholder="Digite o nome ou código do produto..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e7e5df',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          )}
        </div>

        {/* Tabela de Produtos */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e7e5df',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          {carregando ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#a8a29e' }}>
              ⏳ Carregando produtos...
            </div>
          ) : produtosFiltrados.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#a8a29e' }}>
              <p style={{ fontSize: '16px', margin: 0 }}>
                {buscaTermo ? '🔍 Nenhum produto encontrado' : '📦 Nenhum produto em estoque'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: theme.primary + '10', borderBottom: `2px solid ${theme.primary}` }}>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: 700, color: theme.primary, fontSize: '13px' }}>Produto</th>
                    <th style={{ padding: '14px', textAlign: 'center', fontWeight: 700, color: theme.primary, fontSize: '13px' }}>Categoria</th>
                    <th style={{ padding: '14px', textAlign: 'center', fontWeight: 700, color: theme.primary, fontSize: '13px' }}>Quantidade</th>
                    <th style={{ padding: '14px', textAlign: 'center', fontWeight: 700, color: theme.primary, fontSize: '13px' }}>Local</th>
                    <th style={{ padding: '14px', textAlign: 'center', fontWeight: 700, color: theme.primary, fontSize: '13px' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.map((produto) => (
                    <tr
                      key={produto.id}
                      style={{
                        borderBottom: '1px solid #e7e5df',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafaf8'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td style={{ padding: '14px', color: '#292524', fontWeight: '600' }}>
                        <div style={{ fontSize: '14px' }}>{produto.nome}</div>
                        <div style={{ fontSize: '12px', color: '#78716c', marginTop: '2px' }}>Cód: {produto.codigo_barras}</div>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center', fontSize: '13px', color: '#78716c' }}>
                        {produto.categoria}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: produto.quantidade_atual < 5 ? `${theme.danger}1a` : `${theme.success}1a`,
                          color: produto.quantidade_atual < 5 ? theme.danger : theme.success,
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '13px'
                        }}>
                          {produto.quantidade_atual} un
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center', fontSize: '13px', color: '#78716c' }}>
                        {produto.nome_local || '—'}
                        {produto.prateleira && produto.prateleira !== 'Não informada' && (
                          <div style={{ fontSize: '12px', marginTop: '2px' }}>{produto.prateleira}</div>
                        )}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleRetirada(produto)}
                          disabled={carregando || produto.quantidade_atual < 1}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: produto.quantidade_atual < 1 ? '#cccccc' : theme.danger,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: produto.quantidade_atual < 1 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: produto.quantidade_atual < 1 ? 0.5 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (produto.quantidade_atual >= 1) {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (produto.quantidade_atual >= 1) {
                              e.currentTarget.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '4px' }}>−</span> Retirar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Botão Voltar */}
        <div style={{ marginTop: '28px' }}>
          <button
            onClick={onVoltar}
            style={{
              padding: '12px 20px',
              backgroundColor: 'white',
              color: '#44403c',
              border: '1px solid #e7e5df',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f4'; e.currentTarget.style.borderColor = '#d6d3d1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e7e5df'; }}
          >
            ← Voltar
          </button>
        </div>
      </div>
    </>
  );
}