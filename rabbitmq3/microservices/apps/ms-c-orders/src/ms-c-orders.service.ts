import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class MsCOrdersService {
  public async createStock(data) {
    console.log(`Received message: ${JSON.stringify(data)}`);
  }
}