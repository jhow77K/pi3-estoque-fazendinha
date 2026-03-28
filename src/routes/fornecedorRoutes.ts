import { Router } from "express";
import {
  listarFornecedores,
  criarFornecedor,
  inativarFornecedor,
} from "../controllers/fornecedorController.ts";
const router = Router();

router.get("/", listarFornecedores);
router.post("/", criarFornecedor);
router.patch("/:id/inativar", inativarFornecedor);

export default router;
