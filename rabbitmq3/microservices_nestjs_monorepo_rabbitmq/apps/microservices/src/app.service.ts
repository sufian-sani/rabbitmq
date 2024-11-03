import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
  ) {}

  // stock
  async createStock(stockId:string, strQuantitydata:string, name:string) {
    const strQuantity: string = strQuantitydata
    const quantity = parseInt(strQuantity, 10); // Base 10 conversion
    await this.amqpConnection.publish('stock', 'stock-route', { type: 'create_stock', data: { stockId, quantity, name } }, {});
    console.log('msg published', 'stock', 'stock-route', { type: 'create_stock', data: { stockId, quantity, name } });
  }

  async checkStock() {
    await this.amqpConnection.publish('stock-check', 'stock-check-route', {
      type: 'check_all_stock',
    });
  }

  // create order
  async createOrder(itemId, quantity) {
    await this.amqpConnection.publish('orders', 'orders-route', { type: 'create_order', data: { itemId, quantity } });
    console.log('msg published', 'orders', 'orders-route', { data: { itemId, quantity } });
  }

  // check delivery
  async checkDelivery(orderId) {
    await this.amqpConnection.publish('delivery', 'delivery-route', { data: { orderId } });
    console.log('msg published', 'delivery', 'delivery-route', { data: { orderId } });
  }

  async changeDeliveryStatus(orderDeliverId: string, deliver_status: string) {
    const orderDeliveryDetails = {
      orderDeliverId, deliver_status
    }
    await this.amqpConnection.publish('order-delivery', 'order-delivery-route', { type: 'order-delivery-status', data: { orderDeliveryDetails } });
    console.log('msg published', 'order-delivery', 'order-delivery-route', { data: orderDeliveryDetails });
  }
}
