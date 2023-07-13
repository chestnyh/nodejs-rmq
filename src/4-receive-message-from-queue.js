require('dotenv').config();
const amqp = require('amqplib');

const HOST = process.env.HOST || 'amqp://localhost';

const queue = 'hello';

(async () => {
  try {
    const connection = await amqp.connect(HOST);
    const channel = await connection.createChannel();

    process.once('SIGINT', async () => { 
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(queue, { durable: false });
    await channel.consume(queue, (message) => {
      console.log(`Received: ${message.content.toString()}`);
    }, { noAck: true });

  } catch (err) {
    console.warn(err);
  }
})();