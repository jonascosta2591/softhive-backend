import FazerRegistro from "../querys/registrar.query.js";
import bcrypt from 'bcryptjs'

const JWT_SECRET = "jonas2022#A";

class register {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async registrar() {
    try{
        let { email, senha } = this.req.body;

        const hashedPassword = await bcrypt.hash(senha, 10);

        let registerStatus = await FazerRegistro(email, hashedPassword)

        if(registerStatus){
          return this.res.status(200).json({ msg: "Registrado com sucesso!" });
        }
        return this.res.status(400).json({ error: "Erro ao se registrar!, alguem ja se cadastrou com esse email!" });
        
    }catch(err){
        console.log(err)
        return this.res.status(400).json({error: err, success: false});
    }
  }


}
export default register;