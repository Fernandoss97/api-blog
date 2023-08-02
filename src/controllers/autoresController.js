import autores from "../models/Autor.js";
import bcrypt from "bcrypt";

class AutorController {
  static listarAutores = (request, response) => {
    autores
      .find({}, {senha: 0})
      .then((autores) => {
        response.status(200).json(autores);
      })
      .catch((error) => {
        response.send("Erro ao consultar");
      });
  };

  static listarAutorPorId = async (request, response) => {
    const id = request.params.id;

    await autores.findById(id, "-senha")
      
      .then((autor) => {
        response.status(200).send(autor);
      })
      .catch((error) => {
        response
          .status(400)
          .send({ message: `${error.message} - Id do autor não localizado.` });
      });
  };

  static cadastrarAutor = async (request, response) => {
    const { nome, email, senha, biografia } = request.body;

    if (!nome) {
      return response.status(422).json({ msg: "Obrigatório nome!" });
    }

    if (!email) {
      return response.status(422).json({ msg: "Obrigatório email!" });
    }

    if (!senha) {
      return response.status(422).json({ msg: "Obrigatório senha!" });
    }

    const autorExiste = await autores.findOne({ email: email });

    if (autorExiste) {
      return response.status(422).json({ msg: "Email já está sendo utilizado!" });
    }

    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    const autor = new autores({
      nome,
      email,
      senha: senhaHash,
      biografia,
    });

    try {
      await autor.save();
      response.status(201).json({ msg: "Autor criado com sucesso!" });
    } catch (error) {
      response.status(500).json({ msg: "Falha na criação do Autor"`${error}` });
    }
  };

  static atualizarAutor = async (request, response) => {
    const {nome, biografia} = request.body;

    const id = request.params.id;
    const autorId = request.id;

    const autor = await autores.findById(id);

    if (!autor) {
      return response.status(404).json({ msg: "Autor não encontrado" });
    }

    if (autor.id !== autorId) {
      return response.status(403).json({ msg: "Não é possível atualizar outros autores" });
    }

    
    await autores
      .findByIdAndUpdate(id, { $set: {nome: nome, biografia: biografia }})

      .then((result) => {
        return response
          .status(200)
          .json({ message: "Autor atualizado com sucesso" });
      })
      .catch((error) => {
        return response.status(500).json({ message: "Falha ao atualizar" });
      });

  };

  static removerAutor = async (request, response) => {
    const id = request.params.id;
    const autorId = request.id;

    const autor = await autores.findById(id);

    if (!autor) {
      return response.status(404).json({ msg: "Autor não encontrado" });
    }

    if (autor.id !== autorId) {
      return response
        .status(403)
        .json({ msg: "Não é possível remover outros autores" });
    }

    autores
      .findByIdAndDelete(id)
      .then((result) => {
        response.status(200).send({ message: "Autor removido com sucesso" });
      })
      .catch((error) => {
        response.status(400).send({ message: error.message });
      });
  };
}

export default AutorController;
