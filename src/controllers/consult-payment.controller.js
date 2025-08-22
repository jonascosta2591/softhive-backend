import { consultarPagamento } from "../services/payment.service.js";
import consultaProdutoComprado from "../querys/consultaProdutoComprado.query.js";
import updateTransactionStatus from "../querys/atualiza_status_transaction.query.js";
import select_transaction_by_transactionId from './../querys/select_transaction_by_transactionId.query.js'
import add_softwareComprado from "../querys/add_software_pago.query.js";

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
      //response.status === 'RECEIVED' || response.status === 'CONFIRMED'
      if(true){
        //Adiciona os softwares a tabela "softwares pagos"
        let softwaresComprados = (await consultaProdutoComprado(paymentId)).length
        await updateTransactionStatus('PAID', paymentId) //atualiza status do pagamento no transactions para paid
        if(softwaresComprados === 0){ //verifica se os produtos num ja estão adicionados
          let [dataTransaction] = await select_transaction_by_transactionId(paymentId)
          let softwaresCompradosArr = dataTransaction.softwares_ids.includes(',') ? dataTransaction.softwares_ids.split(',') : [dataTransaction.softwares_ids]
          
          const data_compra = new Date();
          const liberado = 1
          for(let softwareId of softwaresCompradosArr){
            await add_softwareComprado(idUser, softwareId, liberado, data_compra, paymentId)
          }
          //Adiciona os softwares a tabela "softwares pagos"
        }
        //Atualiza o status do transaction para PAGO
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
