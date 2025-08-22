import mysql from 'mysql2/promise';
import dbConfig from './../database/connect.js';

async function selectAllSoftwares(maxAttempts = 10) {
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    let connection;

    try {
      connection = await mysql.createConnection(dbConfig);
      await connection.beginTransaction();

      const [rows] = await connection.execute(`SELECT * FROM softwares_para_comprar`);

      await connection.commit(); // finaliza a transação
      await connection.end();
      return rows;

    } catch (err) {
      console.error(`Tentativa ${attempts} falhou:`, err.message);

      if (connection) {
        try { await connection.rollback(); } catch (_) {}
        try { await connection.end(); } catch (_) {}
      }

      if (attempts === maxAttempts) {
        throw new Error('Falha na transação após múltiplas tentativas.');
      }

      // espera 1 segundo antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export default selectAllSoftwares;
