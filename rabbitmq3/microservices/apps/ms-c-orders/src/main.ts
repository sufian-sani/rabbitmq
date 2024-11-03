import { NestFactory } from '@nestjs/core';
import {AppModule} from "../../microservices/src/app.module";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {MsCOrdersModule} from "./ms-c-orders.module";


async function bootstrap() {
  const app = await NestFactory.create(MsCOrdersModule);

  // Connect the RabbitMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'my_order_queue_main',               // Queue to listen to
      queueOptions: {
        durable: false,
      },
    },
  });

  // Start the microservice
  await app.startAllMicroservices();

  await app.listen((3003));
}

bootstrap();
