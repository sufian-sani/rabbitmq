import { Module } from '@nestjs/common';
import { MsCOrdersController } from './ms-c-orders.controller';
import { MsCOrdersService } from './ms-c-orders.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {MsCOrdersDatabaseModule} from "./ms-c-orders.database.module";

@Module({
  imports: [
      MsCOrdersDatabaseModule,
  ],
  controllers: [MsCOrdersController],
  providers: [MsCOrdersService],
})
export class MsCOrdersModule {}
