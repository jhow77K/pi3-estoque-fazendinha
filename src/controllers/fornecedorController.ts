import type { Request, Response } from "express";
import { pool } from "../config/database.ts";

export const listarFornecedores = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM fornecedores ORDER BY nome ASC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar fornecedores:", error);
    res.status(500).json({ erro: "Erro interno ao buscar fornecedores" });
  }
};

export const criarFornecedor = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const {
    nome,
    cnpj_cpf,
    telefone,
    cep,
    logradouro,
    bairro,
    cidade,
    estado,
    numero,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO fornecedores 
            (nome, cnpj_cpf, telefone, cep, logradouro, bairro, cidade, estado, numero, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Ativo') RETURNING *`,
      [
        nome,
        cnpj_cpf,
        telefone,
        cep,
        logradouro,
        bairro,
        cidade,
        estado,
        numero,
      ],
    );
    return res.status(201).json({
      mensagem: "Fornecedor cadastrado com sucesso!",
      fornecedor: result.rows[0],
    });
  } catch (error: any) {
    console.error("Erro ao criar fornecedor:", error);
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ erro: "Este CNPJ/CPF já está cadastrado no sistema." });
    }
    return res.status(500).json({ erro: "Erro ao cadastrar fornecedor" });
  }
};

export const inativarFornecedor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE fornecedores SET status = 'Inativo' WHERE id = $1",
      [id],
    );
    res.json({ mensagem: "Fornecedor inativado com sucesso!" });
  } catch (error) {
    console.error("Erro ao inativar fornecedor:", error);
    res.status(500).json({ erro: "Erro ao inativar fornecedor" });
  }
};
