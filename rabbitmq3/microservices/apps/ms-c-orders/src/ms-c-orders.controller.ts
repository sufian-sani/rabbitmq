import { Controller, Get } from '@nestjs/common';
import { MsCOrdersService } from './ms-c-orders.service';
import {MessagePattern, Payload} from "@nestjs/microservices";

@Controller()
export class MsCOrdersController {
  constructor(
      private readonly msCOrdersService: MsCOrdersService
  ) {}

  @MessagePattern({ cmd: 'order_create' })
  async handleCreateStock(@Payload() data: any) {
    const ceateStock = await this.msCOrdersService.createStock(data)
    console.log(ceateStock);
    return 'got ceateOrder';
  }

}
