import mysql from 'mysql2/promise';
import dbConfig from './../database/connect.js'

let maxAttempts = 10;
let attempts = 0

// Função assíncrona para demonstrar a conexão e a query
async function selectAllSoftwares() {
  let connection;
  attempts = attempts + 1
  try {
    connection = await mysql.createConnection(dbConfig);
    // 2. Executa a query simples de SELECT
    const [rows, fields] = await connection.execute(`SELECT * FROM softwares_para_comprar`);
    // 3. Exibe os resultados
    return rows;

  } catch (err) {
    // console.log(err)
    await connection.rollback()
    // Lida com erros de conexão ou de query
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (attempts === maxAttempts) {
        console.error('Limite de tentativas atingido. A operação falhou permanentemente.');
        throw new Error('Falha na transação após múltiplas tentativas.');
    }
  } finally {
    // 4. Garante que a conexão seja fechada, independentemente de haver erro ou não
    if (connection) {
      connection.end();
    }
  }
}

export default selectAllSoftwares