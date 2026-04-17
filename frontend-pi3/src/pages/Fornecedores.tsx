import { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

interface Fornecedor {
  id: number;
  nome: string;
  cnpj_cpf: string;
  telefone: string;
  cidade: string;
  estado: string;
  status: string;
}

interface FornecedoresProps {
  onVoltar: () => void;
}

const IconTruck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;

export default function Fornecedores({ onVoltar }: FornecedoresProps) {
  const { theme } = useTheme();
  const [nome, setNome] = useState('');
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [numero, setNumero] = useState('');

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      const resposta = await fetch('/api/fornecedores');
      if (resposta.ok) {
        const dados = await resposta.json();
        setFornecedores(dados);
      }
    } catch (erro) {
      console.error('Erro ao buscar lista:', erro);
    }
  };

  const buscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      setMensagem('🔍 Buscando CEP...');
      setTipoMensagem('');
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
          setMensagem('❌ CEP não encontrado!');
          setTipoMensagem('erro');
        } else {
          setLogradouro(dados.logradouro);
          setBairro(dados.bairro);
          setCidade(dados.localidade);
          setEstado(dados.uf);
          setMensagem('✅ CEP encontrado!');
          setTipoMensagem('sucesso');
        }
      } catch (erro) {
        setMensagem('❌ Erro ao conectar com o ViaCEP.');
        setTipoMensagem('erro');
      }
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('💾 Salvando...');
    setTipoMensagem('');

    const dadosEnvio = {
      nome,
      cnpj_cpf: cnpjCpf,
      telefone,
      cep,
      logradouro,
      bairro,
      cidade,
      estado,
      numero
    };

    try {
      const resposta = await fetch('/api/fornecedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosEnvio)
      });

      const retorno = await resposta.json();

      if (resposta.ok) {
        setMensagem('✅ ' + retorno.mensagem);
        setTipoMensagem('sucesso');
        carregarFornecedores();

        setNome(''); setCnpjCpf(''); setTelefone(''); setCep('');
        setLogradouro(''); setBairro(''); setCidade(''); setEstado(''); setNumero('');
      } else {
        setMensagem('❌ ' + retorno.erro);
        setTipoMensagem('erro');
      }
    } catch (erro) {
      setMensagem('❌ Erro ao salvar o fornecedor.');
      setTipoMensagem('erro');
    }
  };

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 40px)', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1200px', margin: '0 auto', backgroundColor: theme.background, minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ backgroundColor: theme.primary + '20', padding: '12px', borderRadius: '12px', color: theme.primary }}>
          <IconTruck />
        </div>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(24px, 6vw, 32px)', color: '#1c1917', fontWeight: 800 }}>Gerenciar Fornecedores</h1>
          <p style={{ margin: '4px 0 0 0', color: '#78716c', fontSize: 'clamp(12px, 3vw, 14px)' }}>Cadastre e gerencie seus fornecedores</p>
        </div>
      </div>

      {/* Mensagem de Feedback */}
      {mensagem && (
        <div style={{
          padding: '14px 16px',
          backgroundColor: tipoMensagem === 'sucesso' ? '#f0fdf4' : tipoMensagem === 'erro' ? '#fef2f2' : '#fffbeb',
          color: tipoMensagem === 'sucesso' ? '#166534' : tipoMensagem === 'erro' ? '#991b1b' : '#b45309',
          border: `1px solid ${tipoMensagem === 'sucesso' ? '#86efac' : tipoMensagem === 'erro' ? '#fecaca' : '#fcd34d'}`,
          borderRadius: '8px',
          marginBottom: '24px',
          fontWeight: '500',
          fontSize: '14px'
        }}>
          {mensagem}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '40px' }}>
        
        {/* Formulário */}
        <div style={{
          backgroundColor: 'white',
          padding: '28px',
          borderRadius: '16px',
          border: '1px solid #e7e5df',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 700, color: '#292524' }}>Novo Fornecedor</h2>
          
          <form onSubmit={handleSalvar}>
            {/* Dados Principais */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>Nome da Empresa</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Fazenda das Flores"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e7e5df',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>CNPJ / CPF</label>
              <input
                type="text"
                value={cnpjCpf}
                onChange={(e) => setCnpjCpf(e.target.value)}
                placeholder="00.000.000/0000-00"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e7e5df',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>Telefone</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e7e5df',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Endereço */}
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#292524', marginBottom: '16px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e7e5df' }}>Endereço</h3>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>CEP</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={buscarCep}
                placeholder="12345-678"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e7e5df',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>Logradouro</label>
              <input
                type="text"
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
                placeholder="Rua, Avenida, etc."
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e7e5df',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>Número</label>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="123"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e7e5df',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>Bairro</label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Bairro"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e7e5df',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>Cidade</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="São Paulo"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e7e5df',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#44403c', marginBottom: '6px' }}>UF</label>
                <input
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value.toUpperCase())}
                  placeholder="SP"
                  maxLength={2}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e7e5df',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    textTransform: 'uppercase'
                  }}
                />
              </div>
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: theme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ✓ Cadastrar Fornecedor
              </button>
              <button
                type="button"
                onClick={onVoltar}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'white',
                  color: '#44403c',
                  border: '1px solid #e7e5df',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f4'; e.currentTarget.style.borderColor = '#d6d3d1'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e7e5df'; }}
              >
                ← Voltar
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Fornecedores */}
        <div style={{
          backgroundColor: 'white',
          padding: '28px',
          borderRadius: '16px',
          border: '1px solid #e7e5df',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 700, color: '#292524' }}>Fornecedores Cadastrados</h2>
          
          {fornecedores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#a8a29e' }}>
              <p style={{ fontSize: '16px' }}>📦 Nenhum fornecedor cadastrado ainda</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fornecedores.map((forn) => (
                <div
                  key={forn.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#fafaf8',
                    border: '1px solid #e7e5df',
                    borderRadius: '10px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f4';
                    e.currentTarget.style.borderColor = theme.primary;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#fafaf8';
                    e.currentTarget.style.borderColor = '#e7e5df';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: '#292524' }}>{forn.nome}</h4>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#78716c' }}>📄 {forn.cnpj_cpf}</p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#78716c' }}>📍 {forn.cidade}/{forn.estado}</p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#78716c' }}>📞 {forn.telefone}</p>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: forn.status === 'ativo' ? '#dcfce7' : '#fee2e2',
                      color: forn.status === 'ativo' ? '#166534' : '#991b1b',
                      fontSize: '12px',
                      fontWeight: '600',
                      borderRadius: '6px'
                    }}>
                      {forn.status === 'ativo' ? '✓ Ativo' : '✗ Inativo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}