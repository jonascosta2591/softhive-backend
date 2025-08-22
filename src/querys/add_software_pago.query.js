import mysql from 'mysql2/promise';
import dbConfig from '../database/connect.js';

async function add_softwareComprado(usuario_id, software_id, liberado, data_compra, transactionId) {
  let connection;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      connection = await mysql.createConnection(dbConfig);
      await connection.beginTransaction();

      const [rows] = await connection.execute(
        `INSERT INTO softwares_pagos (usuario_id, software_id, liberado, data_compra, transactionId) 
         VALUES (?, ?, ?, ?, ?)`,
        [usuario_id, software_id, liberado, data_compra, transactionId]
      );

      await connection.commit();
      await connection.end();
      return rows;

    } catch (err) {
      if (connection) {
        await connection.rollback();
        await connection.end();
      }

      if (attempts === maxAttempts) {
        console.error('Limite de tentativas atingido. A operação falhou permanentemente.');
        throw new Error('Falha na transação após múltiplas tentativas.');
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // espera antes de tentar de novo
    }
  }
}

export default add_softwareComprado