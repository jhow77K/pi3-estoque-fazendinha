import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { listarProdutos, registrarSaida } from '../Services/produtoService.ts'; 
import type { Produto } from '../types/index.ts'; 

interface SaidaProps {
  onVoltar: () => void;
}

export default function Saida({ onVoltar }: SaidaProps) {
  const [codigoLido, setCodigoLido] = useState('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [mensagem, setMensagem] = useState('');
  const [modoManual, setModoManual] = useState(false);
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [buscaTermo, setBuscaTermo] = useState('');
  const [sugestoes, setSugestoes] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await listarProdutos();
        setProdutos(dados);
      } catch (err) {
        console.error("Erro ao carregar produtos", err);
      }
    };
    carregar();
  }, []);

  // Scanner de Câmera
  useEffect(() => {
    if (modoManual || codigoLido) return;
    const scanner = new Html5QrcodeScanner('leitor-saida', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
    scanner.render((texto) => { setCodigoLido(texto); scanner.clear(); }, () => {});
    return () => { scanner.clear().catch(() => {}); };
  }, [modoManual, codigoLido]);

  const lidarComDigitacao = (texto: string) => {
    setBuscaTermo(texto);
    if (texto.length > 0) {
      const filtrados = produtos.filter(p => 
        p.nome.toLowerCase().includes(texto.toLowerCase()) || 
        p.codigo_barras.includes(texto)
      );
      setSugestoes(filtrados);
    } else {
      setSugestoes([]);
    }
  };

  const selecionarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setCodigoLido(produto.codigo_barras || produto.nome);
    setBuscaTermo(produto.nome);
    setSugestoes([]);
  };

  const finalizarSaida = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dados = await registrarSaida({ 
        codigo_barras: codigoLido, 
        quantidade_saida: quantidade 
      });

      setMensagem(`✅ Baixa registrada com sucesso!`);
      
      setTimeout(() => {
        setCodigoLido('');
        setProdutoSelecionado(null);
        setBuscaTermo('');
        setQuantidade(1);
        setModoManual(false);
        setMensagem('');
      }, 3000);

    } catch (erro: any) { 
      setMensagem(`${erro.message || 'Erro de conexão.'}`); 
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Dar Baixa no Estoque (Saída)</h2>
        <button onClick={onVoltar} style={{ padding: '8px 12px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Voltar</button>
      </div>

      {!codigoLido && (
        <div style={{ textAlign: 'center' }}>
          {!modoManual ? (
            <div>
              <div id="leitor-saida" style={{ width: '100%', border: '2px solid #ccc', borderRadius: '8px', marginBottom: '15px' }}></div>
              <button onClick={() => setModoManual(true)} style={{ color: '#0066cc', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
                Buscar por Nome ou Código
              </button>
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px', border: '1px solid #ffcc80', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Qual produto deseja retirar?</label>
              
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={buscaTermo} 
                  onChange={(e) => lidarComDigitacao(e.target.value)} 
                  placeholder="Digite o nome (ex: Milho) ou código..." 
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }} 
                  autoFocus
                />
                
                {sugestoes.length > 0 && (
                  <ul style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '0 0 8px 8px', zIndex: 10, listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
                    {sugestoes.map((p) => (
                      <li 
                        key={p.id} 
                        onClick={() => selecionarProduto(p)} 
                        style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <strong>{p.nome}</strong>
                        <span style={{ color: p.quantidade_atual < 5 ? 'red' : 'green' }}>{p.quantidade_atual} em estoque</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => { setModoManual(false); setBuscaTermo(''); setSugestoes([]); }} style={{ flex: 1, padding: '12px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar Busca</button>
              </div>
            </div>
          )}
        </div>
      )}

      {codigoLido && (
        <form onSubmit={finalizarSaida} style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
            <p style={{ margin: 0, fontSize: '18px' }}>Produto selecionado:</p>
            <h3 style={{ margin: '5px 0 0 0', color: '#1565c0' }}>{produtoSelecionado ? produtoSelecionado.nome : codigoLido}</h3>
            {produtoSelecionado && (
              <>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#555' }}>Estoque atual: {produtoSelecionado.quantidade_atual} un.</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#2e7d32', fontWeight: 'bold' }}>
                  📍 Retirar em: {produtoSelecionado.nome_local || 'Geral'} {produtoSelecionado.prateleira && produtoSelecionado.prateleira !== 'Não informada' ? `(${produtoSelecionado.prateleira})` : ''}
                </p>
              </>
            )}
          </div>

          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quantidade para Retirar:</label>
          <input type="number" min="1" max={produtoSelecionado?.quantidade_atual} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} required style={{ width: '100%', padding: '12px', marginBottom: '20px', boxSizing: 'border-box', fontSize: '18px', textAlign: 'center' }} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ flex: 2, padding: '15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Confirmar Retirada</button>
            <button type="button" onClick={() => { setCodigoLido(''); setModoManual(true); setProdutoSelecionado(null); setBuscaTermo(''); }} style={{ flex: 1, padding: '15px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Trocar Produto</button>
          </div>
        </form>
      )}

      {mensagem && <p style={{ marginTop: '20px', padding: '15px', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold', backgroundColor: mensagem.includes('❌') ? '#ffebee' : '#e8f5e9', color: mensagem.includes('❌') ? '#c62828' : '#2e7d32' }}>{mensagem}</p>}
    </div>
  );
}