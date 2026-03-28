import { useState } from 'react';
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

function App() {
  const [logado, setLogado] = useState(!!localStorage.getItem('token'));
  
  const [telaAtual, setTelaAtual] = useState<'landing' | 'login' | 'cadastro'>('landing');

  const fazerLogout = () => {
    localStorage.removeItem('token');
    setLogado(false);
    setTelaAtual('landing');
  };

  if (logado) {
    return <Dashboard onLogout={fazerLogout} />;
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
      
      {telaAtual === 'landing' && (
        <LandingPage onAcessarSistema={() => setTelaAtual('login')} />
      )}

      {telaAtual === 'login' && (
        <div style={{ paddingTop: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <LeafLogo />
            <h1 style={{ margin: 0, textAlign: 'center', color: '#1b5e20', fontSize: '28px' }}>Estação Natureza</h1>
          </div>
          
          <Login 
            onLoginSucesso={() => setLogado(true)} 
            onIrParaCadastro={() => setTelaAtual('cadastro')} 
          />
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => setTelaAtual('landing')}
              style={{ background: 'none', border: 'none', color: '#757575', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }}
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
            <h1 style={{ margin: 0, textAlign: 'center', color: '#1b5e20', fontSize: '28px' }}>Estação Natureza</h1>
          </div>
          
          <Cadastro onIrParaLogin={() => setTelaAtual('login')} />
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
             <button 
               onClick={() => setTelaAtual('landing')}
               style={{ background: 'none', border: 'none', color: '#757575', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }}
             >
               Voltar para a página inicial
             </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;