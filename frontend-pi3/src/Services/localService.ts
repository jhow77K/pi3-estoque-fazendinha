import { apiFetch } from "../Services/api.ts";
import type { Local } from "../types/index.ts";

export const listarLocais = async (): Promise<Local[]> => {
  return await apiFetch("/locais");
};

export const criarLocal = async (dadosLocal: Partial<Local>) => {
  return await apiFetch("/locais", {
    method: "POST",
    body: JSON.stringify(dadosLocal),
  });
};

export const atualizarLocal = async (
  id: number,
  dadosLocal: Partial<Local>,
) => {
  return await apiFetch(`/locais/${id}`, {
    method: "PUT",
    body: JSON.stringify(dadosLocal),
  });
};

export const excluirLocal = async (id: number) => {
  return await apiFetch(`/locais/${id}`, {
    method: "DELETE",
  });
};
