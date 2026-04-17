import React from 'react';
import { useTheme } from '../ThemeContext';

interface LandingProps {
  onAcessarSistema: () => void;
}


const IconScan = ({ color }: { color: string }) => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>;
const IconCalendar = ({ color }: { color: string }) => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconShelf = ({ color }: { color: string }) => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><path d="M4 4v16"/><path d="M20 4v16"/></svg>;
const IconChart = ({ color }: { color: string }) => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconHistory = ({ color }: { color: string }) => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><polyline points="12 7 12 12 15 15"/></svg>;
const IconCategories = ({ color }: { color: string }) => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const LeafLogo = ({ color }: { color: string }) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><line x1="2" y1="22" x2="11" y2="20"/></svg>;

export default function Landing({ onAcessarSistema }: LandingProps) {
  const { theme } = useTheme();
  const features = [
    {
      icon: <IconScan color={theme.primary} />,
      title: 'Identificação Ágil',
      description: 'Leitura rápida de QR Code e Código de Barras para registro imediato de entrada e saída.'
    },
    {
      icon: <IconCalendar color={theme.primary} />,
      title: 'Controle de Validade',
      description: 'Monitoramento automatizado para evitar o desperdício de insumos, vacinas e rações.'
    },
    {
      icon: <IconShelf color={theme.primary} />,
      title: 'Endereçamento Exato',
      description: 'Saiba com precisão em qual estante e prateleira cada produto está armazenado.'
    },
    {
      icon: <IconCategories color={theme.primary} />,
      title: 'Filtros por Categoria',
      description: 'Organize itens por Medicamentos, Alimentação ou Ferramentas para buscas rápidas.'
    },
    {
      icon: <IconChart color={theme.primary} />,
      title: 'Visão em Tempo Real',
      description: 'Acompanhe o status do seu inventário com um painel dinâmico e relatórios claros.'
    },
    {
      icon: <IconHistory color={theme.primary} />,
      title: 'Histórico Completo',
      description: 'Rastreabilidade total de quem tirou, quando tirou e a quantidade exata de cada movimentação.'
    }
  ];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333', backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/*Header*/}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 50px', backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LeafLogo />
          <h1 style={{ margin: 0, fontSize: '20px', color: theme.primary, fontWeight: 700, letterSpacing: '-0.5px' }}>
            Estação Natureza
          </h1>
          <span style={{ fontSize: '13px', color: '#757575', marginLeft: '5px', fontWeight: 500 }}>
            | Gestão de Estoque
          </span>
        </div>
        <button 
          onClick={onAcessarSistema}
          style={{ padding: '10px 24px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background-color 0.2s' }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = theme.primaryDark)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme.primary)}
        >
          Acessar Sistema
        </button>
      </header>

      {/*Hero*/}
      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 50px', backgroundColor: `${theme.primaryLight}30`, borderBottom: `1px solid ${theme.primaryLight}50` }}>
        <div style={{ maxWidth: '750px' }}>
          <h2 style={{ fontSize: '46px', color: theme.primary, marginBottom: '24px', lineHeight: '1.2', fontWeight: 800, letterSpacing: '-1px' }}>
            Controle Inteligente para o Campo e Armazém
          </h2>
          <p style={{ fontSize: '18px', color: '#424242', marginBottom: '40px', lineHeight: '1.6', fontWeight: 400 }}>
            Modernize a gestão do Estoque. Reduza perdas por validade, organize insumos com precisão e tenha o controle do seu estoque na palma da mão.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              onClick={onAcessarSistema}
              style={{ padding: '16px 36px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: `0 4px 6px ${theme.primary}33` }}
            >
              Iniciar Operação
            </button>
            <button 
              style={{ padding: '16px 36px', backgroundColor: 'transparent', color: theme.primary, border: `2px solid ${theme.primary}`, borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
              onClick={() => document.getElementById('funcionalidades')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Funcionalidades
            </button>
          </div>
        </div>
      </section>

      {/*Features*/}
      <section id="funcionalidades" style={{ padding: '80px 50px', backgroundColor: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h3 style={{ fontSize: '32px', color: theme.primary, marginBottom: '12px', fontWeight: 700 }}>
            Tudo o que você precisa em um só lugar
          </h3>
          <p style={{ fontSize: '16px', color: '#616161', maxWidth: '550px', margin: '0 auto' }}>
            Do galpão à prateleira, garanta que nenhuma ferramenta se perca ou vacina vença no fundo do armário.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {features.map((feature, index) => (
            <div key={index} style={{ backgroundColor: '#fff', padding: '35px 30px', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${theme.primary}22`; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
            >
              <div style={{ marginBottom: '24px', backgroundColor: `${theme.primaryLight}33`, width: '64px', height: '64px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {feature.icon}
              </div>
              <h4 style={{ fontSize: '20px', color: theme.primary, marginBottom: '12px', fontWeight: 600 }}>{feature.title}</h4>
              <p style={{ fontSize: '15px', color: '#616161', lineHeight: '1.6', margin: 0 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '80px 50px', textAlign: 'center', backgroundColor: theme.primary, color: '#fff' }}>
        <h3 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: 700 }}>Pronto para organizar o Estoque?</h3>
        <p style={{ fontSize: '18px', marginBottom: '40px', color: '#c8e6c9', fontWeight: 400 }}>
          Junte-se a nós e comece a controlar seu estoque de forma profissional e eficiente hoje mesmo.
        </p>
        <button 
          onClick={onAcessarSistema}
          style={{ padding: '16px 48px', backgroundColor: '#fff', color: '#1b5e20', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
        >
          Acessar o Sistema
        </button>
      </section>

      {/*Footer*/}
      <footer style={{ padding: '30px 50px', textAlign: 'center', backgroundColor: '#fafafa', borderTop: '1px solid #eeeeee', color: '#9e9e9e' }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>&copy; 2026 Todos os Direitos Reservados.</p>
        <p style={{ margin: '6px 0 0 0', fontSize: '13px' }}>Desenvolvido pelos alunos da UNIVESP.</p>
      </footer>

    </div>
  );
}