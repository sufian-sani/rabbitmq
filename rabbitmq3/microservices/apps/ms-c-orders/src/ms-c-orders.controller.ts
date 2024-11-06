import {Controller, Get, Inject} from '@nestjs/common';
import { MsCOrdersService } from './ms-c-orders.service';
import {ClientProxy, MessagePattern, Payload, EventPattern} from "@nestjs/microservices";

@Controller()
export class MsCOrdersController {
  constructor(
      private readonly msCOrdersService: MsCOrdersService,
  ) {}

  @MessagePattern({ cmd: 'order_create' })
  async handleCreateStock(@Payload() data: any) {
    const ceateOrder = await this.msCOrdersService.createOrder(data)
    return ceateOrder;
  }

  @MessagePattern({ cmd: 'order_availability_check' })
  async handleCheckOderavailability(orderData) {
    try {
      const orderDetails = await this.msCOrdersService.orderGetFromDatabase(orderData)
      if (orderDetails.success === false){
        return orderDetails;
      }
      const {status, id} = orderDetails;
      const orderDetailsInfo = {status, orderId: id}
      return orderDetailsInfo
    } catch (e) {
      console.error(e);
    }
  }

  @EventPattern('order_status_change_pattern')
  async handleOrderStatusChange(@Payload() data: any) {
    await this.msCOrdersService.changeOrderStatus(data)
  }
}
