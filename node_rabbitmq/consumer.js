const amqp = require('amqplib');

async function sendMail(){
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("mail_queue", {durable:false});
    channel.consume("mail_queue",(message) => {
        if (message !== null){
            console.log("Recv message", JSON.parse(message.content));
            channel.ack(message)
        }
    })

}

sendMail()