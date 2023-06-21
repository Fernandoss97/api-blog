import express from "express";
import autenticacaoController from "../controllers/autenticacaoController.js"

const router = express.Router();

router.get("/", (req, res) => {
 res.status(200).json({ msg: "Blog api FSN" });
});

router.post("/autenticacao/login", autenticacaoController.login);

export default router;