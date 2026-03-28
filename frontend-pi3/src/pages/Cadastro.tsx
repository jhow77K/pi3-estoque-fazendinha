import { useState, type FormEvent } from 'react';
import { cadastrar } from '../Services/authService.ts'; 

interface CadastroProps {
  onIrParaLogin: () => void;
}

export default function Cadastro({ onIrParaLogin }: CadastroProps) {
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
      setMensagem(`Erro: ${erro.message || 'Erro ao conectar com o servidor.'}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Criar Nova Conta</h2>
      <form onSubmit={fazerCadastro}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nome: </label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Senha: </label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#008CBA', color: 'white', border: 'none' }}>
          Cadastrar
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button onClick={onIrParaLogin} style={{ background: 'none', border: 'none', color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}>
          Já tenho uma conta. Fazer Login
        </button>
      </div>

      {mensagem && <p style={{ marginTop: '20px', color: mensagem.includes('Erro') ? 'red' : 'green' }}>{mensagem}</p>}
    </div>
  );
}