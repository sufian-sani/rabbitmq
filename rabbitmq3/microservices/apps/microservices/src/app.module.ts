import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MY_ECOM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // Replace with your RabbitMQ server address
          queue: 'my_queue_main',             // Replace with your queue name
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'MY_ECOM_SERVICE_ORDER',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'my_order_queue_main',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'DELIVERY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'deliver_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'DELIVERY_STATUS_CHANGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'deliver_status_change_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
