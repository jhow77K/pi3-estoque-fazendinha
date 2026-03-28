import { Router } from "express";
import {
  cadastrarProduto,
  listarProdutos,
  registrarSaida,
  listarHistorico,
} from "../controllers/produtoController.ts";
import { verificarToken } from "../middlewares/auth.ts";

const router = Router();

router.post("/", verificarToken, cadastrarProduto);
router.get("/", verificarToken, listarProdutos);
router.post("/saida", verificarToken, registrarSaida);
router.get("/historico", verificarToken, listarHistorico);

export default router;
