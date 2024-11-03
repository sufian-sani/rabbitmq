import { NestFactory } from '@nestjs/core';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {MsAStockModule} from "./ms-a-stock.module";


async function bootstrap() {
  const app = await NestFactory.create(MsAStockModule);

  // Connect the RabbitMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'my_queue_main',               // Queue to listen to
      queueOptions: {
        durable: false,
      },
    },
  });

  // Connect to the second RabbitMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'my_order_stock_check_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  // Start the microservice
  await app.startAllMicroservices();

  await app.listen((3001));
}

bootstrap();
