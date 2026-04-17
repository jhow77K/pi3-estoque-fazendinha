import { useState, type FormEvent } from 'react';
import { login } from '../Services/authService.ts';
import { useTheme } from '../ThemeContext';

interface LoginProps {
  onLoginSucesso: () => void;
  onIrParaCadastro: () => void;
}

export default function Login({ onLoginSucesso, onIrParaCadastro }: LoginProps) {
  const { theme } = useTheme();  // ← ADICIONE ISTO!
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
      setMensagem(`Erro: ${erro.message || 'Erro ao conectar com o servidor.'}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login do Sistema</h2>
      <form onSubmit={fazerLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Senha: </label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: theme.primary, color: 'white', border: 'none' }}>
          Entrar
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button onClick={onIrParaCadastro} style={{ background: 'none', border: 'none', color: theme.link, textDecoration: 'underline', cursor: 'pointer' }}>
          Não tem conta? Cadastre-se
        </button>
      </div>

      {mensagem && <p style={{ marginTop: '20px', color: mensagem.includes('Erro') ? 'red' : 'green' }}>{mensagem}</p>}
    </div>
  );
}