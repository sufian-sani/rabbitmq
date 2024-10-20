const amqp = require('amqplib');

async function sendMail(){
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "main_exchange";
        const routingKey1 = "send_mail_consumer1"
        const routingKey2 = "send_mail_consumer2"
        const message = {
            to: "realtime2@gmail.com",
            from: "jon@gmail.com",
            subject: "Thank you!!",
            body: "Hello jon!!"
        };
        await channel.assertExchange(exchange, "direct", {durable: false});

        await channel.assertQueue("mail_queue1", {durable: false});
        await channel.assertQueue("mail_queue2", {durable: false});

        await channel.bindQueue("mail_queue1", exchange, routingKey1);
        await channel.bindQueue("mail_queue2", exchange, routingKey2);

        channel.publish(exchange, routingKey1, Buffer.from(JSON.stringify(message)));
        channel.publish(exchange, routingKey2, Buffer.from(JSON.stringify(message)));
        console.log("Mail data was send", message)

        setTimeout(()=>{
            connection.close();
        },500)
    } catch (error){
        console.log(error);
    }
}

sendMail();