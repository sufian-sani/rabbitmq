import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { StatusFromOrderService } from "./aliseservice/check-order-status-from-service";

@Injectable()
export class MsBDeliveryService {
  constructor(
      private statusFromOrderService: StatusFromOrderService
  ) {}
  @RabbitSubscribe({
    exchange: 'delivery',
    routingKey: 'delivery-route',
    queue: 'delivery-queue',
  })

  public async checkOrderStatus(data: any) {
    const {orderId} = data.data;
    await this.statusFromOrderService.checkStatusFromOrderService(orderId);
  }
}
