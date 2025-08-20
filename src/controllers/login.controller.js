import Fazerlogin from "../querys/login.query.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = "jonas2022#A";

class Login {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async logar() {
    try {
      let { email, senha } = this.req.body;

      // Busca apenas pelo email
      const [loginData] = await Fazerlogin(email);

      if (!loginData) {
        return this.res
          .status(400)
          .json({ error: "Email ou senha inválidos" });
      }

      // Compara a senha digitada com a hash do banco
      const senhaValida = await bcrypt.compare(senha, loginData.senha);
      if (!senhaValida) {
        return this.res
          .status(400)
          .json({ error: "Email ou senha inválidos" });
      }

      // Gera o token JWT
      const token = jwt.sign({ id: loginData.id }, JWT_SECRET);

      return this.res.status(200).json({
        email: loginData.email,
        nomeCompleto: loginData.nome_completo,
        token,
      });
    } catch (err) {
      console.log(err);
      return this.res.status(500).json({ error: "Erro no servidor", success: false });
    }
  }
}

export default Login;
