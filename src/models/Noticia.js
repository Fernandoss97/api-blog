import mongoose from "mongoose";

const Noticia = mongoose.model( 'Noticia', {
  id: {type: String},
  titulo: {type: String, required: true},
  categoria: {type: String, required: true},
  conteudo: {type: String, required: true},
  autor: {type: mongoose.Schema.Types.ObjectId, ref: 'Autor', require: true},
  dataCriacao: {type: Date, default: Date.now}
})


export default Noticia;