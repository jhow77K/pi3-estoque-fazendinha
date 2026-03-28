import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

interface TokenPayload extends jwt.JwtPayload {
  id: string;
}

export interface CustomRequest extends Request {
  usuarioId?: string;
  usuario?: string | jwt.JwtPayload;
}

export const verificarToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  const tokenHeader = req.headers["authorization"];

  const token = tokenHeader && tokenHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
    return;
  }

  try {
    const decodificado = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload;

    req.usuarioId = decodificado.id;
    req.usuario = decodificado;

    next();
  } catch (erro) {
    res.status(403).json({ erro: "Token inválido ou expirado." });
  }
};
