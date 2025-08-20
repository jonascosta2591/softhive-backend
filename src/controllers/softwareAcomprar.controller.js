import selectAllSoftwares from "../querys/select_all_softwares.query.js";

class SoftwareAcomprar {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async allSoftwares() {
    try{
    //  let { number, month, year } = this.req.query;
        const allSoftwares = await selectAllSoftwares()

        const newAllSoftwares = allSoftwares.map((soft) => {
            return {id: soft.idsoftwares_para_comprar, name: soft.nome_software, image: soft.imagem, price: parseFloat(soft.price), category: soft.category, description: soft.description}
        })
        
        return this.res.status(200).json(newAllSoftwares);
    }catch(err){
        console.log(err)
        return this.res.status(400).json({error: err, success: false});
    }
  }


}
export default SoftwareAcomprar;