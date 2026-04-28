import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode'; 
import { listarLocais } from '../Services/localService.ts'; 
import { listarProdutos, salvarProduto } from '../Services/produtoService.ts'; 
import { useTheme } from '../ThemeContext';
import type { Local, Produto } from '../types/index.ts';

interface EntradaProps {
  onVoltar: () => void;
  onNavigate?: (page: string) => void;
}

export default function Entrada({ onVoltar, onNavigate }: EntradaProps) {
  const { theme } = useTheme();
  const [codigoLido, setCodigoLido] = useState('');
  const [codigoDigitado, setCodigoDigitado] = useState(''); 
  const [mensagem, setMensagem] = useState('');
  const [modoManual, setModoManual] = useState(false);
  const [cameraAtiva, setCameraAtiva] = useState(false); 
  const [salvando, setSalvando] = useState(false);
  const [espelhado, setEspelhado] = useState(false);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [localId, setLocalId] = useState(''); 
  const [dataValidade, setDataValidade] = useState(''); 
  const [prateleira, setPrateleira] = useState(''); 
  const [fornecedorId, setFornecedorId] = useState(''); 
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [locais, setLocais] = useState<Local[]>([]); 
  const [produtosConhecidos, setProdutosConhecidos] = useState<Produto[]>([]);
  const [modoReposicao, setModoReposicao] = useState(false);
  const [estoqueAtualExistente, setEstoqueAtualExistente] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const hojeISO = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [resLocais, resProdutos] = await Promise.all([
          listarLocais(),
          listarProdutos()
        ]);
        setLocais(resLocais);
        setProdutosConhecidos(resProdutos);

        // Verificar se há estantes cadastradas
        if (resLocais.length === 0) {
          setShowModal(true);
        }

        const resFornecedores = await fetch('/api/fornecedores');
        if (resFornecedores.ok) {
          const dadosFornecedores = await resFornecedores.json();
          setFornecedores(dadosFornecedores.filter((f: any) => f.status === 'Ativo'));
        }

      } catch (erro) {
        console.error('Erro ao buscar dados iniciais', erro);
      }
    };
    carregarDadosIniciais();

    return () => { pararCamera(); };
  }, []);

  const extrairCodigoLimpo = (raw: string) => {
    const match = raw.match(/"id"\s*:\s*"([^"]+)"/i);
    if (match && match[1]) {
      return match[1]; 
    }
    
    try {
      const obj = JSON.parse(raw);
      if (obj.id) return String(obj.id);
    } catch (e) {}
    return raw.trim();
  };

  const processarCodigo = (codigoStr: string) => {
    pararCamera(); 

    const codigoLimpo = extrairCodigoLimpo(codigoStr);
    setCodigoLido(codigoLimpo);

    const produtoEncontrado = produtosConhecidos.find(p => 
      p.codigo_barras === codigoLimpo || (p as any).qrcode === codigoLimpo
    );

    if (produtoEncontrado) {
      setNome(produtoEncontrado.nome);
      setCategoria(produtoEncontrado.categoria);
      setLocalId(produtoEncontrado.local_id || '');
      setPrateleira(produtoEncontrado.prateleira || '');
      
      if ((produtoEncontrado as any).fornecedor_id) {
        setFornecedorId(String((produtoEncontrado as any).fornecedor_id));
      }

      if (produtoEncontrado.data_validade) {
        const d = new Date(produtoEncontrado.data_validade);
        setDataValidade(d.toISOString().split('T')[0]); 
      }

      setEstoqueAtualExistente(produtoEncontrado.quantidade_atual);
      setModoReposicao(true);
      setMensagem(''); 
    } else {
      setNome(''); setCategoria(''); setLocalId(''); setPrateleira(''); setDataValidade(''); setFornecedorId('');
      setModoReposicao(false);
      setMensagem('Código Escaneado! Preencha os dados do novo produto.');
    }
    setModoManual(false);
  };

  const iniciarCamera = () => {
    setCameraAtiva(true);
    setMensagem('');

    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode("leitor-camera");
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" }, 
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (textoDecodificado) => {
            processarCodigo(textoDecodificado);
          },
          () => {}
        );
      } catch (err: any) {
        console.error(err);
        setMensagem(`Erro ao acessar câmera. Verifique as permissões.`);
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
        console.error("Erro ao parar câmera", err);
      }
    }
    setCameraAtiva(false);
  };

  const confirmarCodigoManual = () => {
    if (codigoDigitado.trim().length > 0) {
      processarCodigo(codigoDigitado);
    } else {
      setMensagem('Digite um código válido.');
    }
  };

  const handleSalvarProduto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (dataValidade) {
      const dataEscolhida = new Date(dataValidade + 'T00:00:00'); 
      const dataHoje = new Date();
      dataHoje.setHours(0, 0, 0, 0); 

      if (dataEscolhida < dataHoje) {
        setMensagem('Erro: Não é permitido cadastrar produtos com a validade já vencida.');
        return; 
      }
    }

    if (salvando) return;
    
    setSalvando(true); 
    setMensagem('Salvando...');

    try {
      const dados = await salvarProduto({
        nome, categoria, quantidade_atual: quantidade, codigo_barras: codigoLido,
        local_id: localId, data_validade: dataValidade ? dataValidade : null, prateleira,
        fornecedor_id: fornecedorId ? Number(fornecedorId) : null
      });

      setMensagem(`${dados.mensagem || 'Salvo com sucesso!'}`);
      
      const novaListaProdutos = await listarProdutos();
      setProdutosConhecidos(novaListaProdutos);
      
      setTimeout(() => {
        setNome(''); setCategoria(''); setQuantidade(1); setLocalId('');
        setDataValidade(''); setPrateleira(''); setCodigoLido(''); setCodigoDigitado(''); setFornecedorId('');
        setModoReposicao(false); setMensagem(''); setCameraAtiva(false); setEspelhado(false);
      }, 3000); 

    } catch (erro: any) {
      setMensagem(`Erro: ${erro.message || 'Erro de conexão com o servidor.'}`);
    } finally {
      setSalvando(false);
    }
  };

  const estanteSelecionada = locais.find(l => String(l.id) === String(localId));
  const quantidadePrateleiras = estanteSelecionada?.quantidade_prateleiras || 1;

  return (
    <>
      {/* Modal de aviso - Sem estantes */}
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
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗄️</div>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 700, color: '#1c1917' }}>Nenhuma Estante Cadastrada</h2>
            <p style={{ margin: '0 0 24px 0', color: '#78716c', fontSize: '14px', lineHeight: 1.6 }}>
              Para registrar uma entrada de produtos, você deve cadastrar pelo menos uma estante primeiro.
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
                  onNavigate?.('locais');
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
                Cadastrar Estante
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Registrar Nova Entrada</h2>
        <button onClick={() => { pararCamera(); onVoltar(); }} disabled={salvando} style={{ padding: '8px 12px', cursor: salvando ? 'not-allowed' : 'pointer', backgroundColor: salvando ? '#ccc' : '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Voltar</button>
      </div>

      {!codigoLido && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {!modoManual ? (
            <div>
              {cameraAtiva && (
                <div style={{ marginBottom: '15px' }}>
                  <div 
                    id="leitor-camera" 
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      border: '2px solid #4CAF50',
                      transform: espelhado ? 'scaleX(-1)' : 'none',
                      transition: 'transform 0.3s ease-in-out'
                    }}
                  ></div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={pararCamera} style={{ flex: 1, padding: '12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Parar Câmera
                    </button>
                    <button onClick={() => setEspelhado(!espelhado)} style={{ flex: 1, padding: '12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Virar Câmera
                    </button>
                  </div>
                </div>
              )}

              {!cameraAtiva && (
                <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '2px dashed #ccc' }}>
                  <p style={{ color: '#666', marginBottom: '20px' }}>Toque no botão abaixo para ligar a câmera traseira do seu dispositivo.</p>
                  <button onClick={iniciarCamera} style={{ padding: '15px 30px', backgroundColor: '#4d7c0f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    Ligar Câmera
                  </button>
                </div>
              )}
              
              <div style={{ marginTop: '20px' }}>
                <button onClick={() => { pararCamera(); setModoManual(true); }} style={{ background: 'none', border: 'none', color: '#0066cc', textDecoration: 'underline', cursor: 'pointer', fontSize: '16px' }}>Ou digitar código manualmente</button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Digite o Código de Barras / QR Code:</label>
              <input type="text" value={codigoDigitado} onChange={(e) => setCodigoDigitado(e.target.value)} placeholder="Digite o código completo aqui..." style={{ width: '100%', padding: '12px', fontSize: '16px', boxSizing: 'border-box', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={confirmarCodigoManual} style={{ flex: 1, padding: '12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Confirmar Código</button>
                <button onClick={() => { setModoManual(false); setCodigoDigitado(''); }} style={{ flex: 1, padding: '12px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Voltar para Câmera</button>
              </div>
            </div>
          )}
        </div>
      )}

      {codigoLido && (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
          
          {modoReposicao && (
            <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderLeft: '5px solid #ff9800', marginBottom: '20px', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#e65100' }}>Produto já cadastrado! (Reposição)</h4>
              <p style={{ margin: 0, color: '#e65100', fontSize: '14px' }}>A Estação Natureza tem <strong>{estoqueAtualExistente} un.</strong> deste item. Informe abaixo apenas a <strong>nova quantidade</strong> que está entrando.</p>
            </div>
          )}

          <h3 style={{ marginTop: 0 }}>Código: <span style={{ color: '#0066cc' }}>{codigoLido}</span></h3>
          
          <form onSubmit={handleSalvarProduto}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome do Produto:</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={salvando} placeholder="Ex: Milho, Vacina Antirrábica" style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: modoReposicao || salvando ? '#e0e0e0' : '#fff' }} readOnly={modoReposicao} />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoria:</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required disabled={modoReposicao || salvando} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: modoReposicao || salvando ? '#e0e0e0' : '#fff' }}>
                  <option value="" disabled>Selecione a categoria...</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Medicamentos">Medicamentos / Vacinas</option>
                  <option value="Ferramentas">Ferramentas</option>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Insumos">Insumos (Adubos, Sementes)</option>
                  <option value="Limpeza">Limpeza</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: modoReposicao ? '#e65100' : 'black' }}>{modoReposicao ? '+ Qtd Nova:' : 'Qtd:'}</label>
                <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} required disabled={salvando} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: modoReposicao ? '2px solid #ff9800' : '1px solid #ccc', backgroundColor: salvando ? '#e0e0e0' : '#fff' }} autoFocus={modoReposicao} />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fornecedor (Opcional):</label>
              <select 
                value={fornecedorId} 
                onChange={(e) => setFornecedorId(e.target.value)} 
                disabled={salvando} 
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: salvando ? '#e0e0e0' : '#fff' }}
              >
                <option value="">Selecione de quem comprou...</option>
                {fornecedores.map((forn) => (
                  <option key={forn.id} value={forn.id}>
                    {forn.nome}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nova Validade (Opcional):</label>
              <input type="date" value={dataValidade} min={hojeISO} onChange={(e) => setDataValidade(e.target.value)} disabled={salvando} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: salvando ? '#e0e0e0' : '#fff' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Local (Estante):</label>
                <select value={localId} onChange={(e) => setLocalId(e.target.value)} required disabled={salvando} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: salvando ? '#e0e0e0' : '#fff' }}>
                  <option value="" disabled>Selecione a estante...</option>
                  {locais.map((local) => (
                    <option key={local.id} value={local.id}>{local.nome}</option>
                  ))}
                </select>
              </div>

              {localId && (
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#1976d2' }}>Prateleira:</label>
                  <select 
                    value={prateleira} onChange={(e) => setPrateleira(e.target.value)} required disabled={salvando}
                    style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '2px solid #1976d2', backgroundColor: salvando ? '#e0e0e0' : '#e3f2fd', fontWeight: 'bold', color: '#0d47a1' }}
                  >
                    <option value="" disabled>Selecione a prateleira...</option>
                    {Array.from({ length: quantidadePrateleiras }, (_, index) => (
                      <option key={index + 1} value={`Prateleira ${index + 1}`}>Prateleira {index + 1}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={salvando} style={{ flex: 2, padding: '15px', backgroundColor: salvando ? '#81c784' : '#4CAF50', color: 'white', border: 'none', cursor: salvando ? 'wait' : 'pointer', fontWeight: 'bold', borderRadius: '4px', fontSize: '16px' }}>
                  {salvando ? 'Salvando...' : (modoReposicao ? 'Somar ao Estoque' : 'Salvar Novo Produto')}
              </button>
              <button type="button" onClick={() => { setCodigoLido(''); setCodigoDigitado(''); setModoManual(false); setModoReposicao(false); }} disabled={salvando} style={{ flex: 1, padding: '15px', backgroundColor: salvando ? '#ccc' : '#9e9e9e', color: 'white', border: 'none', cursor: salvando ? 'not-allowed' : 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {mensagem && (
        <p style={{ marginTop: '20px', padding: '15px', backgroundColor: mensagem.includes('Erro') ? '#ffebee' : '#e8f5e9', color: mensagem.includes('Erro') ? '#c62828' : '#2e7d32', fontWeight: 'bold', borderRadius: '5px', textAlign: 'center' }}>{mensagem}</p>
      )}
      </div>
    </>
  );
}