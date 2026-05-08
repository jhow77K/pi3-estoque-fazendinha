import { useState, type FormEvent } from 'react';
import { login, normalizarErroAuth } from '../Services/authService.ts';
import { useTheme } from '../ThemeContext';
import AuthShell from './AuthShell';

interface LoginProps {
  onLoginSucesso: () => void;
  onIrParaCadastro: () => void;
}

export default function Login({ onLoginSucesso, onIrParaCadastro }: LoginProps) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const fazerLogin = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem('Carregando...');

    try {
      const dados = await login({ email, senha });

      localStorage.setItem('token', dados.token);
      onLoginSucesso();

    } catch (erro: any) {
      console.error(erro);
      setMensagem(normalizarErroAuth(erro, 'login'));
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '14px',
    border: `1px solid ${theme.primaryLight}`,
    padding: '14px 16px',
    fontSize: '15px',
    color: theme.textPrimary,
    backgroundColor: '#fff',
    outline: 'none',
  };

  return (
    <AuthShell
      eyebrow="Área do usuário"
      title="Entrar"
      subtitle="Digite seu email e sua senha para acessar o estoque e acompanhar as movimentações."
      highlights={['Acesso rápido ao estoque', 'Segurança para seus dados', 'Histórico de movimentações sempre disponível']}
      footerActionLabel="Criar minha conta"
      footerActionText="Ainda não possui acesso? Faça seu cadastro em poucos passos."
      onFooterAction={onIrParaCadastro}
    >
      <div style={{ marginBottom: '4px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: theme.textPrimary }}>Login</h2>
        <p style={{ margin: 0, color: theme.textSecondary, lineHeight: 1.5 }}>
          Informe suas credenciais para continuar.
        </p>
      </div>

      <form onSubmit={fazerLogin} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>Email de acesso</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@exemplo.com"
            required
            style={fieldStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            required
            style={fieldStyle}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '14px 18px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>
          Entrar no sistema
        </button>
      </form>

      {mensagem && (
        <div style={{ marginTop: '18px', padding: '12px 14px', borderRadius: '14px', backgroundColor: mensagem.includes('Erro') ? '#fef2f2' : '#ecfdf5', color: mensagem.includes('Erro') ? theme.danger : theme.success, border: `1px solid ${mensagem.includes('Erro') ? '#fecaca' : '#bbf7d0'}`, fontSize: '14px', lineHeight: 1.5 }}>
          {mensagem}
        </div>
      )}
    </AuthShell>
  );
}