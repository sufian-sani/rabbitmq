import { Controller, Get } from '@nestjs/common';
import { MsBDeliveryService } from './ms-b-delivery.service';
import {Ctx, EventPattern, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";

@Controller()
export class MsBDeliveryController {
  constructor(
      private readonly msBDeliveryService: MsBDeliveryService
  ) {}

  @MessagePattern({ cmd: 'check_delivery_order' })
  async handleCheckDeliveryOrder(@Payload() id: number) {
    return this.msBDeliveryService.checkOrderDelivery(id)
  }

  @MessagePattern({ cmd: 'delivery_status_change_pattern' })
  async handleDeliveryStatusChange(@Payload() data) {
    return this.msBDeliveryService.changeDeliveryStatus(data)
  }


  // order_confirmation_for_deliver
}
