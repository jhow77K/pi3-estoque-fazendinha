import "dotenv/config";
import express from "express";
import cors from "cors";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import produtoRoutes from "./src/routes/produtoRoutes.js";
import localRoutes from "./src/routes/localRoutes.js";
import fornecedorRoutes from "./src/routes/fornecedorRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/locais", localRoutes);
app.use("/api/fornecedores", fornecedorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
