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

      if(response.status === 'RECEIVED' || response.status === 'CONFIRMED'){
        //Adiciona os softwares a tabela "softwares pagos"
      }

      return this.res.status(200).json({
        status: response.status,
        value: response.value,
        dueDate: response.dueDate,
        billingType: response.billingType
      });

    } catch (err) {
      console.log(err);
      return this.res.status(500).json({ error: "Erro no servidor", success: false });
    }
  }
}

export default consultPayment;
