require('dotenv').config();
const amqp = require('amqplib');

const HOST = process.env.HOST || 'amqp://localhost';

(async () => {
  let connection;
  try {
    connection = await amqp.connect(HOST);
    console.log("Connection created");
    const channel = await connection.createChannel();
    console.log("Channel created.");
    await channel.close();
  }
  catch (err) {
    console.warn(err);
  }
  finally {
    if (connection) await connection.close();
  };
})();  