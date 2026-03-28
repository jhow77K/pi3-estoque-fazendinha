import { useState, useEffect } from 'react';

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

export default function Fornecedores({ onVoltar }: FornecedoresProps) {
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

  //ViaCEP
  const buscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, ''); 
    
    if (cepLimpo.length === 8) {
      setMensagem('Buscando CEP...');
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
          setMensagem('CEP não encontrado!');
        } else {
          setLogradouro(dados.logradouro);
          setBairro(dados.bairro);
          setCidade(dados.localidade);
          setEstado(dados.uf);
          setMensagem(''); 
        }
      } catch (erro) {
        setMensagem('Erro ao conectar com o ViaCEP.');
      }
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('Salvando...');

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
        setMensagem(retorno.mensagem);
        carregarFornecedores(); 
        
        setNome(''); setCnpjCpf(''); setTelefone(''); setCep('');
        setLogradouro(''); setBairro(''); setCidade(''); setEstado(''); setNumero('');
      } else {
        setMensagem(`Erro: ${retorno.erro}`);
      }
    } catch (erro) {
      setMensagem('Erro fatal ao salvar o fornecedor.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Gerenciar Fornecedores</h1>
        <button onClick={onVoltar} style={{ padding: '8px 12px', cursor: 'pointer' }}>Voltar</button>
      </div>
      
      {mensagem && <p><strong>Aviso:</strong> {mensagem}</p>}

      <form onSubmit={handleSalvar}>
        <fieldset>
          <legend>Dados Principais</legend>
          
          <label>Nome da Empresa:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <br />

          <label>CNPJ / CPF:</label>
          <input type="text" value={cnpjCpf} onChange={(e) => setCnpjCpf(e.target.value)} required />
          <br />

          <label>Telefone:</label>
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
          <br />
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>
          
          <label>CEP:</label>
          <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={buscarCep} required />
          <br />

          <label>Logradouro (Rua):</label>
          <input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} required />
          <br />

          <label>Número:</label>
          <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} required />
          <br />

          <label>Bairro:</label>
          <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
          <br />

          <label>Cidade:</label>
          <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
          <br />

          <label>Estado (UF):</label>
          <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={2} required />
          <br />
        </fieldset>

        <button type="submit">Cadastrar Fornecedor</button>
      </form>

      <hr />

      <h2>Fornecedores Cadastrados</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ/CPF</th>
            <th>Cidade/UF</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((forn) => (
            <tr key={forn.id}>
              <td>{forn.nome}</td>
              <td>{forn.cnpj_cpf}</td>
              <td>{forn.cidade}/{forn.estado}</td>
              <td>{forn.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}