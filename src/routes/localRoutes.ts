import { Router } from "express";
import {
  listarLocais,
  criarLocal,
  atualizarLocal,
  excluirLocal,
} from "../controllers/localController.ts";
import { verificarToken } from "../middlewares/auth.ts";

const router = Router();

router.get("/", verificarToken, listarLocais);

router.post("/", verificarToken, criarLocal);

router.put("/:id", verificarToken, atualizarLocal);

router.delete("/:id", verificarToken, excluirLocal);

export default router;
