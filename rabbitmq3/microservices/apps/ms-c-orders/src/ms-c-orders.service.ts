import {Inject, Injectable} from '@nestjs/common';
// import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {ClientProxy} from "@nestjs/microservices";
import { Order } from './schemas/order.entity';
import {DataSource, Repository} from "typeorm";

@Injectable()
export class MsCOrdersService {
  private orderRepository: Repository<Order>;
  constructor(
      @Inject('DATA_SOURCE') private dataSource: DataSource,
      @Inject('ORDER_SERVICE_CHECK') private client1: ClientProxy,
  ){
    this.orderRepository = this.dataSource.getRepository(Order);
  }
  public async createOrder(data) {
    try {
      const { stockId, quantity } = data;
      const checkStock = await this.checkStockQuentity(data)
      if(checkStock.affected === 0 || (Array.isArray(checkStock.raw) && checkStock.raw.length === 0)){
        return 'Stock not available of the product item';
      }
      const productData = {
        itemId: stockId,
        quantity
      }
      const newOrder = this.orderRepository.create(productData);
      return await this.orderRepository.save(newOrder);
    } catch (e) {
      console.error(e);
    }
  }
  public checkStockQuentity(data) {
    try {
      const pattern = { cmd: 'check_quentity' };
      return this.client1.send(pattern, data).toPromise();
    } catch (error) {
      console.error(error);
    }
  }
}