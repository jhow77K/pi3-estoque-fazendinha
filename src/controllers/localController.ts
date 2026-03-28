import type { Response } from "express";
import { pool } from "../config/database.ts";
import type { CustomRequest } from "../middlewares/auth.ts";

export const listarLocais = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const usuarioId = req.usuarioId;

  try {
    const locais = await pool.query(
      "SELECT * FROM locais WHERE usuario_id = $1 ORDER BY id ASC",
      [usuarioId],
    );
    res.status(200).json(locais.rows);
  } catch (erro) {
    console.error("Erro ao listar locais:", erro);
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

export const criarLocal = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const usuarioId = req.usuarioId;
  const { nome, descricao, quantidade_prateleiras } = req.body;

  if (!nome) {
    res.status(400).json({ erro: "O nome do local é obrigatório." });
    return;
  }

  try {
    const novoLocal = await pool.query(
      "INSERT INTO locais (usuario_id, nome, descricao, quantidade_prateleiras) VALUES ($1, $2, $3, $4) RETURNING *",
      [usuarioId, nome, descricao, quantidade_prateleiras || 1],
    );

    res.status(201).json({
      mensagem: "Local criado com sucesso!",
      local: novoLocal.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao criar local:", erro);
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
};

export const atualizarLocal = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const usuarioId = req.usuarioId;
  const { id } = req.params;
  const { nome, descricao, quantidade_prateleiras } = req.body;

  if (!nome) {
    res.status(400).json({ erro: "O nome da estante é obrigatório." });
    return;
  }

  try {
    const atualizado = await pool.query(
      "UPDATE locais SET nome = $1, descricao = $2, quantidade_prateleiras = $3 WHERE id = $4 AND usuario_id = $5 RETURNING *",
      [nome, descricao, quantidade_prateleiras || 1, id, usuarioId],
    );

    if (atualizado.rows.length === 0) {
      res.status(404).json({ erro: "Estante não encontrada no seu estoque." });
      return;
    }

    res.status(200).json({
      mensagem: "Estante atualizada com sucesso!",
      local: atualizado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao atualizar estante:", erro);
    res.status(500).json({ erro: "Erro interno no servidor ao atualizar." });
  }
};

export const excluirLocal = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const usuarioId = req.usuarioId;
  const { id } = req.params;

  try {
    const checagem = await pool.query(
      "SELECT COUNT(*) FROM produtos WHERE local_id = $1 AND usuario_id = $2",
      [id, usuarioId],
    );

    const qtdProdutos = parseInt(checagem.rows[0].count, 10);

    if (qtdProdutos > 0) {
      res.status(400).json({
        erro: `Ação bloqueada! Existem ${qtdProdutos} produto(s) cadastrado(s) nesta estante. Mova-os ou dê baixa antes de excluir.`,
      });
      return;
    }

    const deletado = await pool.query(
      "DELETE FROM locais WHERE id = $1 AND usuario_id = $2 RETURNING *",
      [id, usuarioId],
    );

    if (deletado.rows.length === 0) {
      res.status(404).json({ erro: "Estante não encontrada no seu estoque." });
      return;
    }

    res.status(200).json({ mensagem: "Estante excluída com sucesso!" });
  } catch (erro) {
    console.error("Erro ao excluir estante:", erro);
    res.status(500).json({ erro: "Erro interno no servidor ao excluir." });
  }
};
