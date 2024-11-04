import { NestFactory } from '@nestjs/core';
// import {AppModule} from "../../microservices/src/app.module";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {MsBDeliveryModule} from "./ms-b-delivery.module";


async function bootstrap() {
  const app = await NestFactory.create(MsBDeliveryModule);

  // Connect the RabbitMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'deliver_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'deliver_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'order_confirmation_for_deliver',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'deliver_status_change_queue',
      queueOptions: {
        durable: false,
      },
    },
  });


  // Start the microservice
  await app.startAllMicroservices();

  await app.listen((3002));
}

bootstrap();
