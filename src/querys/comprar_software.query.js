import mysql from 'mysql2/promise';
import dbConfig from './../database/connect.js';

async function selectSoftware(ids, connection) {
  const prices = [];

  for (let id of ids) {
    try {
      const [rows] = await connection.execute(
        `SELECT * FROM softwares_para_comprar WHERE idsoftwares_para_comprar = ?`,
        [id]
      );

      rows.forEach(software => prices.push(parseFloat(software.price)));
    } catch (err) {
      console.error(`Erro ao selecionar software ID ${id}:`, err.message);
      throw err; // lança para o retry na função principal
    }
  }

  return prices;
}

async function comprarSoftware(ids, maxAttempts = 10) {
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    let connection;

    try {
      connection = await mysql.createConnection(dbConfig);
      await connection.beginTransaction();

      const prices = await selectSoftware(ids, connection);

      const total = prices.reduce((sum, price) => sum + price, 0);

      await connection.commit(); // confirma a transação
      await connection.end();
      return total.toFixed(2);

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

export default comprarSoftware;
