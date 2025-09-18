import express from "express";
import dotenv from "dotenv";

// Importar as rotas
import userRoutes from "./routes/user/routes.js";
import storeRoutes from "./routes/store/routes.js";
import productRoutes from "./routes/product/routes.js";
import healthcheckRoutes from "./routes/healthcheck/routes.js";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criar aplicação Express
const app = express();

// Middleware para processar JSON nas requisições
app.use(express.json());

// Rotas
app.use("/", healthcheckRoutes);
app.use("/user", userRoutes);
app.use("/store", storeRoutes);
app.use("/product", productRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
