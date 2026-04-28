import { useTheme } from '../ThemeContext';
import { useEffect, useState } from 'react';
import Header from '../Header.tsx';
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
const IconLocation = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="theme.primaryLight" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const IconMinus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>;
const IconBox = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.27 6.96 12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path></svg>;
const IconClock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconTruck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const LeafLogo = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="theme.primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><line x1="2" y1="22" x2="11" y2="20"></line></svg>;


function Dashboard({ onLogout }: DashboardProps) {
  const { theme } = useTheme();  // ← ADICIONE ISTO!
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
      return { texto: dataValidade.toLocaleDateString('pt-BR'), corFundo: '#f7fee7', corTexto: 'theme.primary', borda: '#bef264' };
    }
  };

  const categoriasUnicas = Array.from(new Set(produtos.map((p) => p.categoria))).filter(Boolean);

  const produtosFiltrados = produtos.filter((p) => {
    if (filtroAtivo === 'TODOS') return true;
    if (filtroAtivo === 'BAIXO_ESTOQUE') return p.quantidade_atual < 5;
    return p.categoria === filtroAtivo;
  });

  //Rotas tela com Header
  if (telaAtual === 'entrada') return <>
    <Header paginaAtual="entrada" onNavigate={setTelaAtual} onLogout={onLogout} />
    <Entrada onVoltar={() => setTelaAtual('lista')} onNavigate={setTelaAtual} />
  </>;
  if (telaAtual === 'locais') return <>
    <Header paginaAtual="locais" onNavigate={setTelaAtual} onLogout={onLogout} />
    <Locais onVoltar={() => setTelaAtual('lista')} />
  </>;
  if (telaAtual === 'saida') return <>
    <Header paginaAtual="saida" onNavigate={setTelaAtual} onLogout={onLogout} />
    <Saida onVoltar={() => setTelaAtual('lista')} onNavigate={setTelaAtual} />
  </>;
  if (telaAtual === 'historico') return <>
    <Header paginaAtual="historico" onNavigate={setTelaAtual} onLogout={onLogout} />
    <Historico onVoltar={() => setTelaAtual('lista')} />
  </>;
  if (telaAtual === 'fornecedores') return <>
    <Header paginaAtual="fornecedores" onNavigate={setTelaAtual} onLogout={onLogout} />
    <Fornecedores onVoltar={() => setTelaAtual('lista')} />
  </>;

  return (
    <>
      <Header paginaAtual="lista" onNavigate={setTelaAtual} onLogout={onLogout} />
      <div style={{ padding: 'clamp(16px, 4vw, 40px)', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1300px', margin: '0 auto', backgroundColor: theme.background, minHeight: '100vh' }}>

      {/*Botões de Ação*/}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button onClick={() => setTelaAtual('entrada')} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontWeight: '600', fontSize: 'clamp(12px, 2vw, 13px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', lineHeight: 1 }}>+</span> Entrada
        </button>

        <button onClick={() => setTelaAtual('saida')} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: theme.danger, color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontWeight: '600', fontSize: 'clamp(12px, 2vw, 13px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', lineHeight: 1 }}>−</span> Saída
        </button>
      </div>

      {/*Filtros*/}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', borderBottom: '1px solid #e7e5df', paddingBottom: '12px', overflowX: 'auto' }}>
        <button onClick={() => setFiltroAtivo('TODOS')} style={{ padding: '8px 12px', border: 'none', borderBottom: filtroAtivo === 'TODOS' ? '3px solid ' + theme.primary : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: 'transparent', color: filtroAtivo === 'TODOS' ? '#1c1917' : '#a8a29e', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>Todos</button>

        <button onClick={() => setFiltroAtivo('BAIXO_ESTOQUE')} style={{ padding: '8px 12px', border: 'none', borderBottom: filtroAtivo === 'BAIXO_ESTOQUE' ? '3px solid #c2410c' : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: 'transparent', color: filtroAtivo === 'BAIXO_ESTOQUE' ? '#c2410c' : '#a8a29e', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>Crítico</button>

        {categoriasUnicas.map(cat => (
          <button key={cat} onClick={() => setFiltroAtivo(cat)} style={{ padding: '8px 12px', border: 'none', borderBottom: filtroAtivo === cat ? '3px solid ' + theme.primary : '3px solid transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: 'transparent', color: filtroAtivo === cat ? '#1c1917' : '#a8a29e', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>{cat.slice(0, 8)}</button>
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
    </>
  );
}

export default Dashboard;