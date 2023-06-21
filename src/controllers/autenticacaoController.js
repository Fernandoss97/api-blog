import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Autor from "../models/Autor.js";
import checkToken from "../middlewares/chekToken.js";

class autenticacaoController {
  
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

      return res
        .status(200)
        .json({ msg: "Autenticação realizada com sucesso", token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Falha na autenticação" });
    }
  };
 
}

export default autenticacaoController;
