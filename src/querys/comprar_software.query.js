import mysql from 'mysql2/promise';
import dbConfig from './../database/connect.js'

let maxAttempts = 10;
let attempts = 0


async function selectSoftware(ids, connection){
  let prices = []

  for(let id of ids){
    try{
      const [rows, fields] = await connection.execute(`SELECT * FROM softwares_para_comprar WHERE idsoftwares_para_comprar = ?`, [id]);

      rows.map((softwares) => prices.push(softwares.price))
    }catch(err){
      console.error(err)
      await connection.rollback()
    } 
  }
  if (connection) {
    connection.end();

    return prices
  }
}

// Função assíncrona para demonstrar a conexão e a query
async function comprarSoftware(ids) {
  let connection;
  attempts = attempts + 1
  try {
    
    connection = await mysql.createConnection(dbConfig);
    // 2. Executa a query simples de SELECT
    let prices = await selectSoftware(ids, connection)
    console.log(prices)
    let total = 0
    for(let onePrice of prices){
      total += parseInt(onePrice)
    }
    // 3. Exibe os resultados
    return total;

  } catch (err) {
    console.log(err)
    await connection.rollback()
    // Lida com erros de conexão ou de query
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (attempts === maxAttempts) {
        console.error('Limite de tentativas atingido. A operação falhou permanentemente.');
        throw new Error('Falha na transação após múltiplas tentativas.');
    }
  } 
}

export default comprarSoftware