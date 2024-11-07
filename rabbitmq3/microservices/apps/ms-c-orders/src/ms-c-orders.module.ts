import { Module } from '@nestjs/common';
import { MsCOrdersController } from './ms-c-orders.controller';
import { MsCOrdersService } from './ms-c-orders.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {MsCOrdersDatabaseModule} from "./ms-c-orders.database.module";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
      ClientsModule.register([
          {
              name: 'ORDER_CANCEL_STATUS_BACK_TO_STOCK_SERVICE',
              transport: Transport.RMQ,
              options: {
                  urls: ['amqp://localhost:5672'],
                  queue: 'order_cancel_status_back_to_stock_service_queue', // The queue to both send to and listen from
                  queueOptions: {
                      durable: false,
                  },
              },
          },
      ]),
      MsCOrdersDatabaseModule,
  ],
  controllers: [MsCOrdersController],
  providers: [MsCOrdersService],
})
export class MsCOrdersModule {}
