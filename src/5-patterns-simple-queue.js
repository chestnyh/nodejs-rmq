const amqp = require('amqplib');
const queue = 'our_first_queue';

// publisher
(async () => {
    let connection;
    try {
      connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
  
      await channel.assertQueue(queue, { durable: false });

      const text = "Message from producer."
  
      channel.sendToQueue(queue, Buffer.from(text));
      console.log("[Producer] message sent.")
      await channel.close();
    }
    catch (err) {
      console.warn(err);
    }
    finally {
      if (connection) await connection.close();
    };
})(); 

// consumer
(async () => {
    try {
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
  
      process.once('SIGINT', async () => { 
        await channel.close();
        await connection.close();
      });
  
      await channel.assertQueue(queue, { durable: false });
      await channel.consume(queue, (message) => {
        console.log("[Consumer] Received message: ", message.content.toString());
      }, { noAck: true });
  
    } catch (err) {
      console.warn(err);
    }
})();
