import type { Response } from "express";
import { pool } from "../config/database.ts";
import type { CustomRequest } from "../middlewares/auth.ts";

export const cadastrarProduto = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const usuarioId = req.usuarioId;
  const {
    nome,
    categoria,
    codigo_barras,
    qrcode,
    local_id,
    data_validade,
    quantidade_atual,
    prateleira,
    fornecedor_id,
  } = req.body;

  if (!nome || !categoria || !local_id) {
    res.status(400).json({ erro: "Faltam dados obrigatórios." });
    return;
  }

  try {
    const busca = await pool.query(
      "SELECT id, quantidade_atual FROM produtos WHERE (codigo_barras = $1 OR qrcode = $2) AND usuario_id = $3 LIMIT 1",
      [codigo_barras, qrcode, usuarioId],
    );

    let produtoId;
    let saldoFinal = quantidade_atual || 0;

    if (busca.rows.length > 0) {
      produtoId = busca.rows[0].id;
      saldoFinal = busca.rows[0].quantidade_atual + (quantidade_atual || 0);

      await pool.query(
        "UPDATE produtos SET quantidade_atual = $1, data_validade = $2, local_id = $3, prateleira = $4, fornecedor_id = $5 WHERE id = $6 AND usuario_id = $7",
        [
          saldoFinal,
          data_validade || null,
          local_id,
          prateleira || "Não informada",
          fornecedor_id || null,
          produtoId,
          usuarioId,
        ],
      );
    } else {
      const queryInsert = `
        INSERT INTO produtos (usuario_id, nome, categoria, codigo_barras, qrcode, local_id, data_validade, quantidade_atual, prateleira, fornecedor_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
      `;
      const novo = await pool.query(queryInsert, [
        usuarioId,
        nome,
        categoria,
        codigo_barras,
        qrcode,
        local_id,
        data_validade || null,
        saldoFinal,
        prateleira || "Não informada",
        fornecedor_id || null,
      ]);
      produtoId = novo.rows[0].id;
    }

    if (quantidade_atual > 0) {
      await pool.query(
        "INSERT INTO historico (usuario_id, produto_id, produto_nome, tipo, quantidade, saldo_atual) VALUES ($1, $2, $3, 'ENTRADA', $4, $5)",
        [usuarioId, produtoId, nome, quantidade_atual, saldoFinal],
      );
    }

    res.status(201).json({
      mensagem:
        busca.rows.length > 0
          ? `Reposição salva! Saldo atual: ${saldoFinal} un.`
          : "Produto cadastrado com sucesso!",
    });
  } catch (erro: any) {
    console.error("Erro ao salvar produto:", erro);
    if (erro.code === "22P02") {
      res.status(400).json({ erro: "Formato do Local ID inválido." });
      return;
    }
    res
      .status(500)
      .json({ erro: "Erro interno no servidor ao salvar produto." });
  }
};

export const listarProdutos = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const usuarioId = req.usuarioId;

  try {
    const query = `
      SELECT p.*, l.nome AS nome_local, f.nome AS nome_fornecedor
      FROM produtos p
      LEFT JOIN locais l ON p.local_id = l.id
      LEFT JOIN fornecedores f ON p.fornecedor_id = f.id
      WHERE p.usuario_id = $1
      ORDER BY p.id DESC
    `;
    const produtos = await pool.query(query, [usuarioId]);
    res.status(200).json(produtos.rows);
  } catch (erro) {
    console.error("Erro ao listar produtos:", erro);
    res.status(500).json({ erro: "Erro ao buscar a lista." });
  }
};

export const registrarSaida = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const usuarioId = req.usuarioId;
  const { codigo_barras, quantidade_saida } = req.body;

  if (!codigo_barras || !quantidade_saida) {
    res
      .status(400)
      .json({ erro: "Digite o nome ou o código do produto para dar baixa." });
    return;
  }

  try {
    const busca = await pool.query(
      `SELECT id, nome, quantidade_atual FROM produtos 
       WHERE (codigo_barras = $1 OR qrcode = $1 OR nome ILIKE '%' || $1 || '%') 
       AND usuario_id = $2 LIMIT 1`,
      [codigo_barras, usuarioId],
    );

    if (busca.rows.length === 0) {
      res.status(404).json({ erro: "Produto não encontrado no seu estoque." });
      return;
    }

    const produto = busca.rows[0];

    if (produto.quantidade_atual < quantidade_saida) {
      res.status(400).json({
        erro: `Estoque insuficiente! Disponível: ${produto.quantidade_atual}`,
      });
      return;
    }

    const novaQuantidade = produto.quantidade_atual - quantidade_saida;

    await pool.query(
      "UPDATE produtos SET quantidade_atual = $1 WHERE id = $2 AND usuario_id = $3",
      [novaQuantidade, produto.id, usuarioId],
    );

    await pool.query(
      "INSERT INTO historico (usuario_id, produto_id, produto_nome, tipo, quantidade, saldo_atual) VALUES ($1, $2, $3, 'SAÍDA', $4, $5)",
      [usuarioId, produto.id, produto.nome, quantidade_saida, novaQuantidade],
    );

    res.status(200).json({
      mensagem: `Saída de ${quantidade_saida} un. de "${produto.nome}" registrada!`,
      saldo_restante: novaQuantidade,
    });
  } catch (erro) {
    console.error("Erro na saída de produto:", erro);
    res.status(500).json({ erro: "Erro ao processar saída." });
  }
};

export const listarHistorico = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const usuarioId = req.usuarioId;

  try {
    const query = `
      SELECT id, tipo, quantidade, data_hora, produto_nome, saldo_atual 
      FROM historico
      WHERE usuario_id = $1
      ORDER BY data_hora DESC
    `;
    const historico = await pool.query(query, [usuarioId]);
    res.status(200).json(historico.rows);
  } catch (erro) {
    console.error("Erro ao listar histórico:", erro);
    res
      .status(500)
      .json({ erro: "Erro ao buscar histórico de movimentações." });
  }
};
