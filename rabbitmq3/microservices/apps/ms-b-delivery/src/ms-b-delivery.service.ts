import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class MsBDeliveryService {
  @RabbitSubscribe({
    exchange: 'delivery',
    routingKey: 'delivery-route',
    queue: 'delivery-queue',
  })

  public async pubSubHandler(msg: {}) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }
}