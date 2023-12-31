require('dotenv').config();
const amqp = require('amqplib');

const HOST = process.env.HOST || 'amqp://localhost';
const queue = 'many_consumers_queue';

// publisher
(async () => {
    let connection;
    try {
      connection = await amqp.connect(HOST);
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, { durable: false });

      setTimeout(() => {
        // Ten messages sent
        for(let i = 0; i < 10; i++) {
            const text = `Message from producer No ${i}.`
            channel.sendToQueue(queue, Buffer.from(text));
            console.log(`[Producer] message No ${i} sent.`)
          }
      }, 1000);

    }
    catch (err) {
      console.warn(err);
    }
})(); 

// consumer
(async () => {
    try {
        for (let i = 0; i < 5; i++){
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            process.once('SIGINT', async () => { 
                await channel.close();
                await connection.close();
            });
  
            await channel.assertQueue(queue, { durable: false });
            await channel.consume(
                queue, 
                (message) => {
                    console.log(`[Consumer ${i}] Received message: `, message.content.toString());
                    channel.ack(message);
                }, 
                {noAck: false}
            );
        }
    } catch (err) {
      console.warn(err);
    }
})();