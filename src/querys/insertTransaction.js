import mysql from 'mysql2/promise';
import dbConfig from './../database/connect.js';
import dayjs from 'dayjs';

async function insertTransaction(
  cpf, id_customer, price, transaction_id, name, user_id, statusTransaction, softwares_ids,
  maxAttempts = 10
) {
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    let connection;

    try {
      connection = await mysql.createConnection(dbConfig);
      await connection.beginTransaction();

      const data_de_hoje = dayjs().format();

      const [rows] = await connection.execute(
        `INSERT INTO transactions 
        (cpf, id_customer, price, transaction_id, name, user_id, status, data, softwares_ids) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [cpf, id_customer, price, transaction_id, name, user_id, statusTransaction, data_de_hoje, softwares_ids]
      );

      await connection.commit();
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

export default insertTransaction;
