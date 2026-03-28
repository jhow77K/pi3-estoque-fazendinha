import { useEffect, useState } from 'react';
import Entrada from './Entrada.tsx';
import Locais from './Locais.tsx';
import Saida from './Saida.tsx'; 
import Historico from './Historico.tsx';
import Fornecedores from './Fornecedores.tsx'; 

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade_atual: number;
  nome_local: string;
  codigo_barras: string;
  data_validade: string | null; 
  prateleira: string;
  fornecedor_id?: number | null;
  nome_fornecedor?: string;
}

interface DashboardProps {
  onLogout: () => void;
}

// Ícones 
const IconLocation = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#65a30d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const IconMinus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>;
const IconBox = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.27 6.96 12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path></svg>;
const IconClock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconTruck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const LeafLogo = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4d7c0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><line x1="2" y1="22" x2="11" y2="20"></line></svg>;

function Dashboard({ onLogout }: DashboardProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState('');
  const [telaAtual, setTelaAtual] = useState<'lista' | 'entrada' | 'locais' | 'saida' | 'historico' | 'fornecedores'>('lista');
  const [filtroAtivo, setFiltroAtivo] = useState<string>('TODOS');

  useEffect(() => {
    if (telaAtual !== 'lista') return;

    const carregarProdutos = async () => {
      const token = localStorage.getItem('token');
      try {
        const resposta = await fetch('/api/produtos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          setProdutos(dados);
        } else {
          setErro('Erro ao carregar produtos.');
        }
      } catch (err) {
        setErro('Erro de conexão com a API.');
      }
    };
    carregarProdutos();
  }, [telaAtual]);

  const analisarValidade = (dataIso: string | null) => {
    if (!dataIso) return { texto: 'Sem validade', corFundo: '#f5f5f4', corTexto: '#a8a29e' }; 

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 
    
    const dataValidade = new Date(dataIso);
    dataValidade.setMinutes(dataValidade.getMinutes() + dataValidade.getTimezoneOffset());

    const diffTempo = dataValidade.getTime() - hoje.getTime();
    const diffDias = Math.ceil(diffTempo / (1000 * 3600 * 24));

    if (diffDias < 0) {
      return { texto: `Vencido há ${Math.abs(diffDias)}d`, corFundo: '#fef2f2', corTexto: '#b91c1c', borda: '#fca5a5' }; 
    } else if (diffDias <= 30) {
      return { texto: `Vence em ${diffDias}d`, corFundo: '#fffbeb', corTexto: '#b45309', borda: '#fcd34d' }; 
    } else {
      return { texto: dataValidade.toLocaleDateString('pt-BR'), corFundo: '#f7fee7', corTexto: '#4d7c0f', borda: '#bef264' }; 
    }
  };

  const categoriasUnicas = Array.from(new Set(produtos.map((p) => p.categoria))).filter(Boolean);

  const produtosFiltrados = produtos.filter((p) => {
    if (filtroAtivo === 'TODOS') return true;
    if (filtroAtivo === 'BAIXO_ESTOQUE') return p.quantidade_atual < 5;
    return p.categoria === filtroAtivo;
  });

  //Rotas tela
  if (telaAtual === 'entrada') return <Entrada onVoltar={() => setTelaAtual('lista')} />;
  if (telaAtual === 'locais') return <Locais onVoltar={() => setTelaAtual('lista')} />;
  if (telaAtual === 'saida') return <Saida onVoltar={() => setTelaAtual('lista')} />;
  if (telaAtual === 'historico') return <Historico onVoltar={() => setTelaAtual('lista')} />;
  if (telaAtual === 'fornecedores') return <Fornecedores onVoltar={() => setTelaAtual('lista')} />;

  return (
    <div style={{ padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', maxWidth: '1300px', margin: '0 auto', backgroundColor: '#faf8f5', minHeight: '100vh' }}>
      
      {/*Header*/}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '2px solid #e7e5df' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#ecfccb', padding: '10px', borderRadius: '12px' }}>
            <LeafLogo />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#3f6212', fontWeight: 800 }}>Estação Natureza</h1>
            <p style={{ margin: 0, color: '#78716c', fontSize: '15px', fontWeight: 500 }}>Gestão de Estoque</p>
          </div>
        </div>
        <button onClick={onLogout} style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'transparent', color: '#a8a29e', border: '1px solid #d6d3d1', padding: '10px 16px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', transition: 'all 0.2s', fontSize: '14px' }}
          onMouseOver={(e) => { e.currentTarget.style.color = '#78716c'; e.currentTarget.style.borderColor = '#78716c'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = '#a8a29e'; e.currentTarget.style.borderColor = '#d6d3d1'; }}
        >
          Sair
        </button>
      </div>
      
      {/*Painel*/}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '40px' }}>
        <button onClick={() => setTelaAtual('entrada')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', backgroundColor: '#4d7c0f', color: 'white', border: 'none', padding: '20px', cursor: 'pointer', borderRadius: '16px', fontWeight: '700', fontSize: '18px', boxShadow: '0 4px 6px -1px rgba(77, 124, 15, 0.2), 0 2px 4px -2px rgba(77, 124, 15, 0.2)', transition: 'transform 0.1s' }}
         onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}><IconPlus /></div>
          Entrada de Itens
        </button>
        
        <button onClick={() => setTelaAtual('saida')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', backgroundColor: '#c2410c', color: 'white', border: 'none', padding: '20px', cursor: 'pointer', borderRadius: '16px', fontWeight: '700', fontSize: '18px', boxShadow: '0 4px 6px -1px rgba(194, 65, 12, 0.2), 0 2px 4px -2px rgba(194, 65, 12, 0.2)', transition: 'transform 0.1s' }}
         onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}><IconMinus /></div>
          Registrar Saída
        </button>

        <button onClick={() => setTelaAtual('locais')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', backgroundColor: 'white', color: '#44403c', border: '1px solid #e7e5df', padding: '20px', cursor: 'pointer', borderRadius: '16px', fontWeight: '700', fontSize: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#78716c' }}><IconBox /></div>
          Gerenciar Estantes
        </button>

        <button onClick={() => setTelaAtual('fornecedores')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', backgroundColor: 'white', color: '#44403c', border: '1px solid #e7e5df', padding: '20px', cursor: 'pointer', borderRadius: '16px', fontWeight: '700', fontSize: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#78716c' }}><IconTruck /></div>
          Gerenciar Fornecedores
        </button>

        <button onClick={() => setTelaAtual('historico')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', backgroundColor: 'white', color: '#44403c', border: '1px solid #e7e5df', padding: '20px', cursor: 'pointer', borderRadius: '16px', fontWeight: '700', fontSize: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#78716c' }}><IconClock /></div>
          Ver Histórico
        </button>
      </div>

      {/*Filtros*/}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '30px', borderBottom: '1px solid #e7e5df', paddingBottom: '1px', overflowX: 'auto' }}>
        <button onClick={() => setFiltroAtivo('TODOS')} style={{ padding: '10px 4px', border: 'none', borderBottom: filtroAtivo === 'TODOS' ? '3px solid #4d7c0f' : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', backgroundColor: 'transparent', color: filtroAtivo === 'TODOS' ? '#1c1917' : '#a8a29e', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>Todos os Itens</button>
        
        <button onClick={() => setFiltroAtivo('BAIXO_ESTOQUE')} style={{ padding: '10px 4px', border: 'none', borderBottom: filtroAtivo === 'BAIXO_ESTOQUE' ? '3px solid #c2410c' : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', backgroundColor: 'transparent', color: filtroAtivo === 'BAIXO_ESTOQUE' ? '#c2410c' : '#a8a29e', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>Estoque Crítico</button>

        {categoriasUnicas.map(cat => (
          <button key={cat} onClick={() => setFiltroAtivo(cat)} style={{ padding: '10px 4px', border: 'none', borderBottom: filtroAtivo === cat ? '3px solid #4d7c0f' : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', backgroundColor: 'transparent', color: filtroAtivo === cat ? '#1c1917' : '#a8a29e', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>{cat}</button>
        ))}
      </div>

      {erro && <div style={{ padding: '16px', backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '20px', fontWeight: '500' }}>{erro}</div>}

      {/*Grid*/}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((p) => {
            const validadeStatus = analisarValidade(p.data_validade);
            const alertaEstoque = p.quantidade_atual < 5;
            
            return (
              <div key={p.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                padding: '24px', 
                border: alertaEstoque ? '2px solid #fed7aa' : '1px solid #e7e5df',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02)'; }}>
                
                {/*Categoria e Validade*/}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#78716c', letterSpacing: '0.05em' }}>
                    {p.categoria}
                  </span>
                  <span style={{ 
                    padding: '4px 10px', 
                    backgroundColor: validadeStatus.corFundo, 
                    color: validadeStatus.corTexto, 
                    border: `1px solid ${validadeStatus.borda}`,
                    fontWeight: '700', 
                    fontSize: '11px', 
                    borderRadius: '8px' 
                  }}>
                    {validadeStatus.texto}
                  </span>
                </div>

                {/*Nome e Estoque*/}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#292524', fontWeight: '800', lineHeight: '1.2' }}>{p.nome}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '900', color: alertaEstoque ? '#c2410c' : '#3f6212', lineHeight: '1' }}>
                      {p.quantidade_atual}
                    </span>
                    <span style={{ color: '#a8a29e', fontWeight: '600', fontSize: '14px' }}>em estoque</span>
                  </div>
                </div>

                {/*Localização*/}
                <div style={{ paddingTop: '16px', borderTop: '1px dashed #e7e5df', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IconLocation />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#44403c' }}>{p.nome_local || 'Área Geral'}</span>
                    {p.prateleira && p.prateleira !== 'Não informada' && (
                      <span style={{ fontSize: '13px', color: '#78716c' }}>{p.prateleira}</span>
                    )}
                  </div>
                </div>

                {p.nome_fornecedor && (
                  <div style={{ paddingTop: '12px', marginTop: '12px', borderTop: '1px solid #f5f5f4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: '#a8a29e' }}><IconTruck /></div>
                    <span style={{ fontSize: '13px', color: '#57534e', fontWeight: '500' }}>
                      Fornecedor: <strong style={{ color: '#292524' }}>{p.nome_fornecedor}</strong>
                    </span>
                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', color: '#a8a29e', fontSize: '16px', backgroundColor: 'transparent', border: '2px dashed #d6d3d1', borderRadius: '16px', fontWeight: '500' }}>
            Nenhum item foi encontrado nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;