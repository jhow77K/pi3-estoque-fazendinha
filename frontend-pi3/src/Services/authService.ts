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

export const normalizarErroAuth = (erro: unknown, contexto: "login" | "cadastro") => {
  const mensagemBruta = erro instanceof Error ? erro.message : "";

  if (contexto === "login") {
    if (mensagemBruta.toLowerCase().includes("email ou senha incorretos")) {
      return "Email ou senha incorretos.";
    }

    if (mensagemBruta.toLowerCase().includes("erro no login")) {
      return "Não foi possível entrar agora. Verifique seus dados e tente novamente.";
    }

    return mensagemBruta || "Não foi possível entrar agora. Tente novamente.";
  }

  if (mensagemBruta.toLowerCase().includes("erro no cadastro")) {
    return "Não foi possível cadastrar. Verifique se o email já existe e tente novamente.";
  }

  if (mensagemBruta.toLowerCase().includes("duplicate key") || mensagemBruta.toLowerCase().includes("unique")) {
    return "Esse email já existe. Use outro email para continuar.";
  }

  return mensagemBruta || "Não foi possível cadastrar. Tente novamente.";
};

export const logout = () => {
  localStorage.removeItem("token");
};
