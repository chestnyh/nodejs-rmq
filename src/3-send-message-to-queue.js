const amqp = require('amqplib');

const queue = 'hello';
const text = 'Hello World1!';

(async () => {
  let connection;
  try {
    connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });

    console.log(channel.sendToQueue(queue, Buffer.from(text)));
    await channel.close();
  }
  catch (err) {
    console.warn(err);
  }
  finally {
    if (connection) await connection.close();
  };
})(); 