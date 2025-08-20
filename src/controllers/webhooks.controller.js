import buysoft from "../querys/comprar_software.query.js";
import insertTransaction from "../querys/insertTransaction.js";
import transactionByCPF from './../querys/transactionsByCpf.query.js'
import { criarCliente } from './../services/customer.service.js'
import { criarCobrancaPix, getPixTransactionData } from './../services/payment.service.js'
import dayjs from 'dayjs';

class WebHooks {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async recebe() {
    try{
        // let { softwaresIds, paymentMethod } = this.req.body;
        
        
        return this.res.status(200).json({msg: 'webhooks'});
    }catch(err){
        console.log(err)
        return this.res.status(400).json({error: err, success: false});
    }
  }


}
export default WebHooks;