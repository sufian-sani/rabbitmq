import {AmqpConnection, RabbitSubscribe} from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable} from '@nestjs/common';
// import {Model} from "mongoose";
// import {Order} from "./interfaces/order.interface";
import { Order } from './schemas/order.entity';
// import {StockCheckByServiceService} from "./aliceservice/productstock-check.service";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class MsCOrdersService {
  private orderRepository: Repository<Order>;
  constructor(
      @Inject('DATA_SOURCE') private dataSource: DataSource,
      private readonly amqpConnection: AmqpConnection,
      // private productStockCheck: StockCheckByServiceService
  ) {
    this.orderRepository = this.dataSource.getRepository(Order);
  }
  @RabbitSubscribe({
    exchange: 'orders',
    routingKey: 'orders-route',
    queue: 'orders-queue',
  })

  public async pubSubHandler(data: any) {
    try {
      if (data.type === 'create_order') {
        await this.checkItemStock(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async checkItemStock(data) {
    this.amqpConnection.publish('stock-product', 'stock-product-route', {
      type: 'check_stock_by_id',
      data
    });
  }
}
