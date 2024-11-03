import {Inject, Injectable} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class AppService {
  constructor(
      @Inject('MY_ECOM_SERVICE_ORDER') private clientOrder: ClientProxy,
  ) {}

  // stock
  // async checkStock(itemName, quantity) {
  //   // await this.amqpConnection.publish('stock', 'stock-route', { data: { itemName, quantity } });
  //   console.log('msg published', 'stock', 'stock-route', { data: { itemName, quantity } });
  // }

  // async createStock(stockId:string, quantity:number, name:string) {
  //   // await this.amqpConnection.publish('stock', 'stock-route', { type: 'create_stock', data: {stockId, quantity, name} })
  //   console.log('msg published', 'stock', 'stock-route', { type: 'create_stock', data: { stockId, quantity, name } });
  // }

  async createOrder(data) {
    // await this.amqpConnection.publish('orders', 'orders-route', { data: { customerName, itemName, quantity } });
    const pattern = { cmd: 'order_create' };
    // const { stockId, quantity } = data;
    return this.clientOrder.send(pattern, data).toPromise();
    // console.log(stockId, quantity);
    // const pattern = { cmd: 'order_create' };
    // console.log('msg published', 'orders', 'orders-route', data);
  }

  // async checkDelivery(customerName) {
  //   // await this.amqpConnection.publish('delivery', 'delivery-route', { data: { customerName } });
  //   console.log('msg published', 'delivery', 'delivery-route', { data: { customerName } });
  // }
}
