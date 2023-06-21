import express from "express";
import db from "./config/dbConnect.js";
import autenticacaoRoutes from "./routes/autenticacaoRoutes.js";
import autoresRoutes from "./routes/autoresRoutes.js"
import noticiasRoutes from "./routes/noticiasRoutes.js"

db.on("error", console.log.bind(console, "Erro deconexão"));
db.once("open", () => {
  console.log("Conectado com o banco");
});

const app = express();
app.use(express.json());
app.use(autenticacaoRoutes);
app.use(autoresRoutes);
app.use(noticiasRoutes);

export default app;
