import { apiFetch } from "../Services/api.ts";
import type { Usuario } from "../types/index.ts";

interface Credenciais {
  email: string;
  senha: string;
}

export const login = async (credenciais: Credenciais) => {
  return await apiFetch("/usuarios/login", {
    method: "POST",
    body: JSON.stringify(credenciais),
  });
};

export const cadastrar = async (dadosUsuario: Usuario & { senha: string }) => {
  return await apiFetch("/usuarios/cadastro", {
    method: "POST",
    body: JSON.stringify(dadosUsuario),
  });
};

export const logout = () => {
  localStorage.removeItem("token");
};
