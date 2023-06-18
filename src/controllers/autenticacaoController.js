import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Autor from "../models/Autor.js";

class autenticacaoController {
  static registro = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
      return res.status(422).json({ msg: "Obrigatório nome!" });
    }

    if (!email) {
      return res.status(422).json({ msg: "Obrigatório email!" });
    }

    if (!senha) {
      return res.status(422).json({ msg: "Obrigatório senha!" });
    }

    const autorExiste = await Autor.findOne({ email: email });

    if (autorExiste) {
      return res.status(422).json({ msg: "Email já está sendo utilizado!" });
    }

    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    const autor = new Autor({
      nome,
      email,
      senha: senhaHash,
    });

    try {
      await autor.save();
      res.status(201).json({ msg: "Autor criado com sucesso!" });
    } catch (error) {
      res.status(500).json({ msg: "Falha na criação do Autor"`${error}` });
    }
  };

  static login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email) {
      return res.status(422).json({ msg: "Obrigatório email!" });
    }

    if (!senha) {
      return res.status(422).json({ msg: "Obrigatório senha!" });
    }

    const autor = await Autor.findOne({ email: email });

    if (!autor) {
      return res.status(404).json({ msg: "Autor não encontrado!" });
    }

    const checkSenha = await bcrypt.compare(senha, autor.senha);

    if (!checkSenha) {
      return res.status(422).json({ msg: "Senha inválida" });
    }

    try {
      const token = jwt.sign(
        {
          id: autor._id,
        },
        process.env.SECRET
      );

      res
        .status(200)
        .json({ msg: "Autenticação realizada com sucesso", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Falha na autenticação" });
    }
  };

  static getById = async (req, res) =>{
    const id = req.params.id;

    try{
      await autenticacaoController.checkToken(req);
      const autor = await Autor.findById(id, "-senha");

      if (!autor) {
        return res.status(404).json({ msg: "Autor não encontrado" });
      }

      res.status(200).json({ autor });
    }
    catch(error){
      console.log(error);
      res.status(400).json({ msg: "Token inválido!" });
    }
  }

  static checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ msg: "Acesso negado!" });
    }
  
    try {
      jwt.verify(token, process.env.SECRET);
  
      
    } catch (error) {
      res.status(400).json({ msg: "Token inválido!" });
    }
  }

}

export default autenticacaoController;
