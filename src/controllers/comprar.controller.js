import buysoft from "../querys/comprar_software.query.js";
import insertTransaction from "../querys/insertTransaction.js";
import transactionByCPF from './../querys/transactionsByCpf.query.js'
import { criarCliente } from './../services/customer.service.js'
import { criarCobrancaPix, getPixTransactionData } from './../services/payment.service.js'
import dayjs from 'dayjs';

class ComprarSoftware {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async comprar_soft() {
    try{
        let { softwaresIds, paymentMethod } = this.req.body;
        
        const totalPrice = await buysoft(softwaresIds)
        const idUser = this.req.user.id
        
        if(paymentMethod === 'PIX'){
          //Conecta com asaas
          let { paymentUserData } = this.req.body;
          let [ clientData ] = paymentUserData
          
          // antes de criar o cliente verificar se o cpf num já existe no banco de dados
          let consultaTransactions = await transactionByCPF(clientData.cpfCnpj)

            if(consultaTransactions.length > 0){ //se ja existir o cpf nas transactions
              //cria transação com os dados da consultaTransactions
              const [dataTransactions] = consultaTransactions
              const customeId = dataTransactions.id_customer
              const nome = dataTransactions.name
              const cpf = dataTransactions.cpf

              const dueDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

              let postDataToCreatePixTransaction = {
                "customer": customeId,       // ID do cliente no Asaas
                "dueDate": dueDate,         // Data de vencimento
                "value": totalPrice,                  // Valor da cobrança
                "description": "Pagamento do software",
                "externalReference": "123456",   // Opcional, referência própria
                "pixExpirationDate": 3600        // Expiração do PIX em segundos (opcional) = 1 hora
              }
              let pixTransactionData = await criarCobrancaPix(postDataToCreatePixTransaction)

              //cria nova transaction na tabela transactions 
              await insertTransaction(cpf, customeId, totalPrice, pixTransactionData.id, nome, idUser, 'PENDING')

              let qrcodePixData = await getPixTransactionData(pixTransactionData.id)
              return this.res.status(200).json({total: totalPrice, data: [
                qrcodePixData
              ]});
              /**
               * data: [{
                  "id": "pay_0001",
                  "status": "PENDING",
                  "pixQrCode": "00020126370014BR.GOV.BCB.PIX0114...5204000053039865404150.005802BR5925Nome do Cliente6009Cidade do Cli62250525abc123...6304B14F",
                  "pixCopyPaste": "00020126370014BR.GOV.BCB.PIX0114...B14F"
                }]
               * 
               */
            }else{
              let { paymentUserData } = this.req.body;
              let [usedata] = paymentUserData
              let {id: customerId} = await criarCliente(usedata)
              const dueDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

              let postDataToCreatePixTransaction = {
                "customer": customerId,       // ID do cliente no Asaas
                "dueDate": dueDate,         // Data de vencimento
                "value": totalPrice,                  // Valor da cobrança
                "description": "Pagamento do software",
                "externalReference": "123456",   // Opcional, referência própria
                "pixExpirationDate": 3600        // Expiração do PIX em segundos (opcional) = 1 hora
              }
              let pixTransactionData = await criarCobrancaPix(postDataToCreatePixTransaction)

              await insertTransaction(usedata.cpfCnpj, customerId, totalPrice, pixTransactionData.id, usedata.name, idUser, 'PENDING')

              let qrcodePixData = await getPixTransactionData(pixTransactionData.id)

              return this.res.status(200).json({total: totalPrice, data: [
                qrcodePixData
              ]});
              /**
               * data: [{
                  "id": "pay_0001",
                  "status": "PENDING",
                  "pixQrCode": "00020126370014BR.GOV.BCB.PIX0114...5204000053039865404150.005802BR5925Nome do Cliente6009Cidade do Cli62250525abc123...6304B14F",
                  "pixCopyPaste": "00020126370014BR.GOV.BCB.PIX0114...B14F"
                }]
               * 
               */
            }
            
          // await criarCliente(clientData)
        }
        
        return this.res.status(200).json({total: totalPrice});
    }catch(err){
        console.log(err)
        return this.res.status(400).json({error: err, success: false});
    }
  }


}
export default ComprarSoftware;