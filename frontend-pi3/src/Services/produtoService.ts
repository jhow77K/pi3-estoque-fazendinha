import { apiFetch } from "../Services/api.ts";
import type { Produto } from "../types/index.ts";

export const listarProdutos = async (): Promise<Produto[]> => {
  return await apiFetch("/produtos");
};

export const salvarProduto = async (dadosDoProduto: Partial<Produto>) => {
  return await apiFetch("/produtos", {
    method: "POST",
    body: JSON.stringify(dadosDoProduto),
  });
};

export const registrarSaida = async (dadosSaida: {
  codigo_barras: string;
  quantidade_saida: number;
  prateleira?: string;
}) => {
  return await apiFetch("/produtos/saida", {
    method: "POST",
    body: JSON.stringify(dadosSaida),
  });
};

export const listarHistorico = async () => {
  return await apiFetch("/produtos/historico");
};
