const amqp = require('amqplib');

(async () => {
  let connection;
  try {
    connection = await amqp.connect('amqp://localhost');
    console.log("Connection created");
  }
  catch (err) {
    console.warn(err);
  }
  finally {
    if (connection) await connection.close();
  };
})();  