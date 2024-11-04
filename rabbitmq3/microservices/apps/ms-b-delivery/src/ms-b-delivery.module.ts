import { Module } from '@nestjs/common';
import { MsBDeliveryController } from './ms-b-delivery.controller';
import { MsBDeliveryService } from './ms-b-delivery.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {MsBDeliveryModelModule} from "./ms-b-delivery.database.module";
// import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_AVAILABILITY_CHECK',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'order_availability_check_queue', // The queue to both send to and listen from
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'ORDER_STATUS_CHANGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'order_status_change_queue', // The queue to both send to and listen from
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MsBDeliveryModelModule,
  ],
  controllers: [MsBDeliveryController],
  providers: [MsBDeliveryService],
})
export class MsBDeliveryModule {}
