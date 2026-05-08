import { useState, type FormEvent } from 'react';
import { cadastrar, normalizarErroAuth } from '../Services/authService.ts'; 
import { useTheme } from '../ThemeContext';
import AuthShell from './AuthShell';

interface CadastroProps {
  onIrParaLogin: () => void;
}

export default function Cadastro({ onIrParaLogin }: CadastroProps) {
  const { theme } = useTheme();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const fazerCadastro = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem('Criando usuário...');

    try {
      await cadastrar({ nome, email, senha });

      setMensagem('Usuário criado com sucesso! Faça login.');
      setNome(''); 
      setEmail(''); 
      setSenha('');
    } catch (erro: any) {
      console.error(erro);
      setMensagem(normalizarErroAuth(erro, 'cadastro'));
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
      eyebrow="Novo acesso"
      title="Criar conta"
      subtitle="Preencha seus dados para acessar o estoque e acompanhar as movimentações."
      highlights={['Cadastro rápido', 'Dados protegidos', 'Controle completo do estoque']}
      footerActionLabel="Já tenho conta"
      footerActionText="Se você já possui acesso, faça login." 
      onFooterAction={onIrParaLogin}
    >
      <div style={{ marginBottom: '4px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: theme.textPrimary }}>Cadastro</h2>
        <p style={{ margin: 0, color: theme.textSecondary, lineHeight: 1.5 }}>
          Preencha seus dados para criar o usuário.
        </p>
      </div>

      <form onSubmit={fazerCadastro} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>Nome completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome de quem vai acessar o sistema"
            required
            style={fieldStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>Email</label>
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
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>Senha de acesso</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Crie uma senha segura"
            required
            style={fieldStyle}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '14px 18px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>
          Criar conta
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