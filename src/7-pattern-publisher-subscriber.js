require('dotenv').config();
const amqp = require('amqplib');

const HOST = process.env.HOST || 'amqp://localhost';
const exchange = "ex.fan";

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// publisher
(async () => {
    let connection;
    try {
      connection = await amqp.connect(HOST);
      const channel = await connection.createChannel();
  
      await channel.assertExchange(exchange, 'fanout');

      await timeout(1000);

      await channel.publish(exchange, '', Buffer.from('published message'));
      console.log("Message published");
      
      await channel.close();
    }
    catch (err) {
      console.warn(err);
    }
})(); 

// consumers
(async () => {
    try {
        for(let i = 0; i < 3; i++){

            const connection = await amqp.connect(HOST);
            const channel = await connection.createChannel();
        
            process.once('SIGINT', async () => { 
                await channel.close();
                await connection.close();
            });

            const queue = `queue${i}`;
            console.log(queue);

            await channel.assertQueue(queue, { durable: false });
            await channel.bindQueue(queue, exchange);
        
            await channel.consume(queue, (message) => {
                console.log(`[Consumer] get message ${queue} : `, message.content.toString());
            }, 
            { noAck: true }
            );

        }
    } catch (err) {
      console.warn(err);
    }
})();