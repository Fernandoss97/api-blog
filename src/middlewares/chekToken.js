import jwt from "jsonwebtoken";

const checkToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if(!authHeader){
    return response.status(401).json({msg: "token não enviado"})
  }

  if (!token) {
    return response.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET);
    request.id = decode.id;
    
    next();
  } catch (error) {
    
    response.status(400).json({ msg: "Token inválidott!" });
  }
}

export default checkToken;