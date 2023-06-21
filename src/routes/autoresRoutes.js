import express from "express";
import autoresController from "../controllers/autoresController.js"
import checkToken from "../middlewares/chekToken.js";

const router = express.Router();

router.get("/autor/:id", autoresController.listarAutorPorId);
router.get("/autor", autoresController.listarAutores);
router.post("/autor/:id", autoresController.cadastrarAutor);
router.put("/autor/:id", checkToken, autoresController.atualizarAutor);
router.delete("/autor/:id", checkToken, autoresController.removerAutor);

export default router;