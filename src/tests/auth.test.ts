import { describe, it, expect, jest } from "@jest/globals";
import { verificarToken, type CustomRequest } from "../middlewares/auth";
import type { Response, NextFunction } from "express";

describe("Middleware de Autenticação", () => {
  it("Deve retornar erro 401 se nenhum token for fornecido", () => {
    const req = {
      headers: {},
    } as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    verificarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Acesso negado. Token não fornecido.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
