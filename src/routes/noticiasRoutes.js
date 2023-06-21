import express from "express";
import checkToken from "../middlewares/chekToken.js";
import NoticiaController from "../controllers/noticiasController.js";

const router = express.Router();

router.get("/noticia/busca", NoticiaController.listarNoticiasPorTitulo);
router.get("/noticia/busca", NoticiaController.listarNoticiasPorCategoria);
router.get("/noticia/busca", NoticiaController.listarNoticiasPorData);
router.get("/noticia/:id", NoticiaController.listarNoticiaPorId);
router.get("/noticia", NoticiaController.listarNoticias);
router.post("/noticia/registro", checkToken, NoticiaController.cadastrarNoticia);
router.put("/noticia/:id", checkToken, NoticiaController.atualizarNoticia);
router.delete("/noticia/:id", checkToken, NoticiaController.removerNoticia);

export default router;