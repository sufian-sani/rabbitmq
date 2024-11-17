import { NestFactory } from '@nestjs/core';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import { MsDUserModule } from './ms-d-user.module';

async function bootstrap() {
  const app = await NestFactory.create(MsDUserModule);

  // create user
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'register_queue',              // Queue to listen to
      queueOptions: {
        durable: false,
      },
    },
  });

  // login user
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'login_queue',              // Queue to listen to
      queueOptions: {
        durable: false,
      },
    },
  });

  // check user
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'], // RabbitMQ server URL
      queue: 'check_auth_queue',              // Queue to listen to
      queueOptions: {
        durable: false,
      },
      // exchange: 'check_auth_exchange',
      // exchangeType: 'header',
    },
  });

  // Start the microservice
  await app.startAllMicroservices();

  await app.listen(process.env.port ?? 3003);
}
bootstrap();
