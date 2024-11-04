import {Controller, Get, Inject} from '@nestjs/common';
import { MsCOrdersService } from './ms-c-orders.service';
import {ClientProxy, MessagePattern, Payload, EventPattern} from "@nestjs/microservices";

@Controller()
export class MsCOrdersController {
  constructor(
      private readonly msCOrdersService: MsCOrdersService,
      // @Inject('ORDER_CHECK_CONFIRMATION_FOR_DELIVERY') private orderCheckConfirmation: ClientProxy,
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
      const {status, id} = orderDetails;
      // const pattern = { cmd: 'order_check_for_delivery' };
      const orderDetailsInfo = {status, orderId: id}
      return orderDetailsInfo
      // return this.orderCheckConfirmation.send(pattern, orderDetailsInfo).toPromise();
      // console.log(orderDetailsInfo)
    } catch (e) {
      console.error(e);
    }
  }

  @EventPattern('order_status_change_pattern')
  async handleOrderStatusChange(@Payload() data: any) {
    await this.msCOrdersService.changeOrderStatus(data)
  }
}
