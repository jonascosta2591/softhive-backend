import buysoft from "../querys/comprar_software.query.js";

class ComprarSoftware {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async comprar_soft() {
    try{
        let { softwaresIds, paymentMethod } = this.req.body;
        
        const totalPrice = await buysoft(softwaresIds)
        const idUser = this.req.user 
       console.log(idUser)
        // const newAllSoftwares = allSoftwares.map((soft) => {
        //     return {id: soft.idsoftwares_para_compra, name: soft.nome_software, img: soft.imagem, price: soft.price}
        // })
        

        if(paymentMethod === 'Credit Card'){
          //Conecta com asaas
        }
        return this.res.status(200).json({total: totalPrice});
    }catch(err){
        console.log(err)
        return this.res.status(400).json({error: err, success: false});
    }
  }


}
export default ComprarSoftware;