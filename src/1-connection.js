require('dotenv').config();
const amqp = require('amqplib');

const HOST = process.env.HOST || 'amqp://localhost';

(async () => {
  let connection;
  try {
    connection = await amqp.connect(HOST);
    console.log("Connection created");
  }
  catch (err) {
    console.warn(err);
  }
  finally {
    if (connection) await connection.close();
  };
})();  