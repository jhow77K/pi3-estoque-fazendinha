import type { Request, Response } from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const cadastrarUsuario = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { nome, email, senha } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = await pool.query(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, senhaHash],
    );
    res
      .status(201)
      .json({ mensagem: "Usuário cadastrado!", usuario: novoUsuario.rows[0] });
  } catch (erro) {
    console.error("Erro no backend durante o cadastro:", erro);
    res.status(500).json({ erro: "Erro no cadastro." });
  }
};

export const loginUsuario = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, senha } = req.body;
  try {
    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email],
    );

    if (resultado.rows.length === 0) {
      res.status(401).json({ erro: "Email ou senha incorretos." });
      return;
    }

    const usuario = resultado.rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      res.status(401).json({ erro: "Email ou senha incorretos." });
      return;
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );
    res.status(200).json({
      mensagem: "Login realizado!",
      usuario: { nome: usuario.nome },
      token,
    });
  } catch (erro) {
    console.error("Erro no backend durante o login:", erro);
    res.status(500).json({ erro: "Erro no login." });
  }
};
