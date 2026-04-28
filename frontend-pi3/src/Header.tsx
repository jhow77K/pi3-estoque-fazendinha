import { useTheme } from './ThemeContext';
import { useState } from 'react';

interface HeaderProps {
  paginaAtual: string;
  onNavigate: (pagina: string) => void;
  onLogout: () => void;
}

const LeafLogo = ({ color }: { color: string }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
    <line x1="2" y1="22" x2="11" y2="20"></line>
  </svg>
);

export default function Header({ paginaAtual, onNavigate, onLogout }: HeaderProps) {
  const { theme } = useTheme();
  const [menuAberto, setMenuAberto] = useState(false);

  const opcoes = [
    { id: 'lista', label: '📦 Produtos' },
    { id: 'locais', label: '🗄️ Estantes' },
    { id: 'fornecedores', label: '🚚 Fornecedores' },
    { id: 'historico', label: '📜 Histórico' },
  ];

  const handleNavegar = (pagina: string) => {
    onNavigate(pagina);
    setMenuAberto(false);
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: theme.primary,
      color: 'white',
      borderBottom: `3px solid ${theme.primaryDark}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      gap: '12px'
    }}>
      {/* Logo e Título */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <LeafLogo color="white" />
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 800 }}>Estação Natureza</h1>
          <p style={{ margin: 0, fontSize: '11px', opacity: 0.9, display: 'none' }}>Gestão de Estoque</p>
        </div>
      </div>

      {/* Menu Desktop */}
      <nav style={{ 
        display: 'none',
        gap: '8px', 
        alignItems: 'center', 
        flex: 1, 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        '@media (min-width: 768px)': { display: 'flex' }
      }}>
        {opcoes.map(opcao => (
          <button
            key={opcao.id}
            onClick={() => handleNavegar(opcao.id)}
            style={{
              padding: '8px 14px',
              backgroundColor: paginaAtual === opcao.id ? theme.primaryLight : 'transparent',
              color: 'white',
              border: `2px solid ${paginaAtual === opcao.id ? theme.primaryLight : 'transparent'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: paginaAtual === opcao.id ? 'bold' : '500',
              fontSize: '13px',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (paginaAtual !== opcao.id) {
                e.currentTarget.style.backgroundColor = `${theme.primaryLight}33`;
              }
            }}
            onMouseLeave={(e) => {
              if (paginaAtual !== opcao.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {opcao.label}
          </button>
        ))}
      </nav>

      {/* Menu Hamburger Mobile */}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          backgroundColor: 'transparent',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          padding: '8px'
        }}
      >
        <div style={{ width: '24px', height: '3px', backgroundColor: 'white', borderRadius: '2px' }}></div>
        <div style={{ width: '24px', height: '3px', backgroundColor: 'white', borderRadius: '2px' }}></div>
        <div style={{ width: '24px', height: '3px', backgroundColor: 'white', borderRadius: '2px' }}></div>
      </button>

      {/* Botão Logout Desktop */}
      <button
        onClick={onLogout}
        style={{
          display: 'none',
          padding: '8px 16px',
          backgroundColor: 'transparent',
          color: 'white',
          border: '2px solid white',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '13px',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
          '@media (min-width: 768px)': { display: 'block' }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        Sair
      </button>

      {/* Menu Mobile */}
      {menuAberto && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: theme.primaryDark,
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 99
        }}>
          {opcoes.map(opcao => (
            <button
              key={opcao.id}
              onClick={() => handleNavegar(opcao.id)}
              style={{
                padding: '12px 14px',
                backgroundColor: paginaAtual === opcao.id ? theme.primaryLight : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: paginaAtual === opcao.id ? 'bold' : '500',
                fontSize: '14px',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (paginaAtual !== opcao.id) {
                  e.currentTarget.style.backgroundColor = `${theme.primaryLight}33`;
                }
              }}
              onMouseLeave={(e) => {
                if (paginaAtual !== opcao.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {opcao.label}
            </button>
          ))}
          <button
            onClick={() => { onLogout(); setMenuAberto(false); }}
            style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.2s',
              marginTop: '8px'
            }}
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
}
