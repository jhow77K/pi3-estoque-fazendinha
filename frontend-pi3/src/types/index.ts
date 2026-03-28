export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade_atual: number;
  local_id?: string;
  nome_local?: string;
  codigo_barras: string;
  data_validade: string | null;
  prateleira?: string;
  fornecedor_id?: number | null;
  nome_fornecedor?: string;
}

export interface Local {
  id: number;
  nome: string;
  descricao: string;
  quantidade_prateleiras: number;
}

export interface Usuario {
  id?: string;
  nome: string;
  email: string;
}

export interface Movimentacao {
  id: string;
  tipo: string;
  quantidade: number;
  data_hora: string;
  produto_nome: string;
  saldo_atual: number;
}

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj_cpf: string;
  telefone: string;
  cidade: string;
  estado: string;
  status: string;
}
