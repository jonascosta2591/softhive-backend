import jwt from "jsonwebtoken";


export default (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    // Verifica o token
    const decoded = jwt.verify(token, 'jonas2022#A');
    // console.log(decoded);
    req.user = decoded; // Salva as informações decodificadas do token

    next(); // Passa para o próximo middleware ou controller
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};