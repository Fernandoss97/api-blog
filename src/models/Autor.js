import mongoose from "mongoose";

const Autor = mongoose.model('Autor', {
  nome: String,
  email: String,
  senha: String,
  biografia: String,
})

export default Autor;