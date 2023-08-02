import noticias from "../models/Noticia.js"

class NoticiaController{
  static listarNoticias = (request, response) => {
    const {titulo, categoria, dataCriacao} = request.query;
    const filtro = {};

    if(titulo){
      filtro.titulo = titulo;
    }

    if(categoria){
      filtro.categoria = categoria;
    }

    if(dataCriacao){
      filtro.dataCriacao = dataCriacao;
    }

    noticias.find(filtro)

    .then((noticias) => {
      response.status(200).json(noticias);
    })
    .catch((error) => {
      response.send('Erro ao consultar');
    })
  }

  static listarNoticiaPorId = (request, response) => {
    const id = request.params.id;

    noticias.findById(id)
      .then((noticia) => {
        response.status(200).send(noticia);
      })
      .catch((error) => {
        response.status(400).send({message: `${error.message} - Id da noticia não localizado.`})
      })
  }

  static cadastrarNoticia = async (request, response) =>{
    let noticia = new noticias(request.body);
     
    const idAutor = request.id;
    noticia.autor = idAutor;
    //console.log(idAutor);

    await noticia.save()
    
    .then((noticia) => {
      response.status(201).send(noticia.toJSON());
    })
    .catch((error) => {
      response.status(500).send({message: `${error.message} - falha ao cadastrar noticia.`})
    })
  }

  static atualizarNoticia = async (request, response) => {
    const id = request.params.id;

    const noticia = await noticias.findById(id);
    const autorId = noticia.autor.toString();

    if (!noticia) {
      return response.status(404).json({ msg: "Noticia não encontrada" });
    }

    if (autorId !== request.id) {
      return response.status(403).json({ msg: "Não é possível atualizar noticias de outros autores" });
    }


    noticias.findByIdAndUpdate(id, {$set: request.body})
    .then((result) => {
      response.status(200).send({message: 'Noticia atualizada com sucesso'})
    })
    .catch((error) => {
      response.status(500).send({message: error.message});
    })
  }

  static removerNoticia = async (request, response) => {
    const id = request.params.id;
    

    const noticia = await noticias.findById(id);
    const autorId = noticia.autor.toString();
    //console.log(autorId)


    if (!noticia) {
      return response.status(404).json({ msg: "Noticia não encontrada" });
    }

    if (autorId !== request.id) {
      return response.status(403).json({ msg: "Não é possível remover noticias de outros autores" });
    }
    
    noticias.findByIdAndDelete(id)
    .then((result) =>{
      response.status(200).send({message: 'Noticia removida com sucesso'});
    })
    .catch((error) => {
      response.status(400).send({message: error.message});
    })
     

  }
  
}

export default NoticiaController;