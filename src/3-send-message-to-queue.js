require('dotenv').config();
const amqp = require('amqplib');

const HOST = process.env.HOST || 'amqp://localhost';

const queue = 'hello';
const text = 'Hello World1!';

// producer
(async () => {
  let connection;
  try {
    connection = await amqp.connect(HOST);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });

    channel.sendToQueue(queue, Buffer.from(text));
    console.log("Message sent");
    await channel.close();
  }
  catch (err) {
    console.warn(err);
  }
  finally {
    if (connection) await connection.close();
  };
})(); 