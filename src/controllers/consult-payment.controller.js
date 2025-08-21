import { consultarPagamento } from "../services/payment.service.js";

const JWT_SECRET = "jonas2022#A";

class consultPayment {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async consult() {
    try {
      let { paymentId } = this.req.query;

      const idUser = this.req.user.id

      const response = await consultarPagamento(paymentId)

      const [data] = response

      if(data.status === 'RECEIVED' || data.status === 'CONFIRMED'){
        //Adiciona os softwares a tabela "softwares pagos"
      }

      return this.res.status(200).json({
        status: data.status,
        value: data.value,
        dueDate: data.dueDate,
        billingType: data.billingType
      });

    } catch (err) {
      console.log(err);
      return this.res.status(500).json({ error: "Erro no servidor", success: false });
    }
  }
}

export default consultPayment;
