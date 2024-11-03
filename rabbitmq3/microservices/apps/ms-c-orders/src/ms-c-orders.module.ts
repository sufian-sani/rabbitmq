import { Module } from '@nestjs/common';
import { MsCOrdersController } from './ms-c-orders.controller';
import { MsCOrdersService } from './ms-c-orders.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'orders',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
    }),
    MsCOrdersModule,
  ],
  controllers: [MsCOrdersController],
  providers: [MsCOrdersService],
})
export class MsCOrdersModule {}
