const amqp = require('amqplib');
const queue = 'our_first_queue';

// publisher
(async () => {
    let connection;
    try {
      connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, { durable: false });

      // ################

      setTimeout(() => {
        for(let i = 0; i < 10; i++) {
            const text = `Message from producer No ${i}.`
            channel.sendToQueue(queue, Buffer.from(text));
            console.log(`[Producer] message No ${i} sent.`)
          }
      }, 1000);

      // ###############
    }
    catch (err) {
      console.warn(err);
    }
    // finally {
    //   if (connection) await connection.close();
    // };
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
                    // channel.ack(message);
                }, 
                //{noAck: false}
            );
        }
    } catch (err) {
      console.warn(err);
    }
})();