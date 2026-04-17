import { useState } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import LandingPage from './pages/Landing.tsx';
import Login from './pages/Login.tsx';
import Cadastro from './pages/Cadastro.tsx';
import Dashboard from './pages/Dashboard.tsx';

const LeafLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
    <line x1="2" y1="22" x2="11" y2="20"></line>
  </svg>
);

// Componente interno que USA o tema
function AppContent() {
  const { theme, toggleTheme, modoColorblind } = useTheme();

  const [logado, setLogado] = useState(!!localStorage.getItem('token'));
  const [telaAtual, setTelaAtual] = useState<'landing' | 'login' | 'cadastro'>('landing');

  const fazerLogout = () => {
    localStorage.removeItem('token');
    setLogado(false);
    setTelaAtual('landing');
  };

  if (logado) {
    return (
      <>
        {/* BOTÃO DE TOGGLE COLORBLIND - CANTO INFERIOR ESQUERDO */}
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '12px 16px',
              backgroundColor: modoColorblind ? theme.primaryLight : theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '50px',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.padding = '12px 24px';
              e.currentTarget.style.width = '160px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.padding = '12px 16px';
              e.currentTarget.style.width = 'auto';
            }}
            title="Alternar para modo colorblind"
          >
            {modoColorblind ? '🎨 Normal' : '👁️ Colorblind'}
          </button>
        </div>
        <Dashboard onLogout={fazerLogout} />
      </>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: theme.background, minHeight: '100vh' }}>

      {/* BOTÃO DE TOGGLE COLORBLIND - CANTO INFERIOR ESQUERDO */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '12px 16px',
            backgroundColor: modoColorblind ? theme.primaryLight : theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '50px',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.padding = '12px 24px';
            e.currentTarget.style.width = '160px';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.padding = '12px 16px';
            e.currentTarget.style.width = 'auto';
          }}
          title="Alternar para modo colorblind"
        >
          {modoColorblind ? '🎨 Normal' : '👁️ Colorblind'}
        </button>
      </div>

      {telaAtual === 'landing' && (
        <LandingPage onAcessarSistema={() => setTelaAtual('login')} />
      )}

      {telaAtual === 'login' && (
        <div style={{ paddingTop: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <LeafLogo />
            <h1 style={{ margin: 0, textAlign: 'center', color: theme.primary, fontSize: '28px' }}>Estação Natureza</h1>
          </div>

          <Login
            onLoginSucesso={() => setLogado(true)}
            onIrParaCadastro={() => setTelaAtual('cadastro')}
          />

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setTelaAtual('landing')}
              style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }}
            >
              Voltar para a página inicial
            </button>
          </div>
        </div>
      )}

      {telaAtual === 'cadastro' && (
        <div style={{ paddingTop: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <LeafLogo />
            <h1 style={{ margin: 0, textAlign: 'center', color: theme.primary, fontSize: '28px' }}>Estação Natureza</h1>
          </div>

          <Cadastro onIrParaLogin={() => setTelaAtual('login')} />

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setTelaAtual('landing')}
              style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }}
            >
              Voltar para a página inicial
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Componente externo que ENVOLVE com ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}