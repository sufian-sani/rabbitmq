import {Inject, Injectable, NotFoundException} from '@nestjs/common';
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
      @Inject('ORDER_CANCEL_STATUS_BACK_TO_STOCK_SERVICE') private clientOrderForStock: ClientProxy,
  ){
    this.orderRepository = this.dataSource.getRepository(Order);
  }
  public async createOrder(data) {
    try {
      const { stockId, quantity } = data;
      const checkStock = await this.checkStockQuentity(data)
      if(checkStock.affected === 0 || (Array.isArray(checkStock.raw) && checkStock.raw.length === 0)){
        return {
          success: false,
          message: 'Stock not available of the product'
        }
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

  public async orderGetFromDatabase(orderId:number) {
    try {
      const order = await this.orderRepository.findOne({ where: { id: orderId } });
      if (!order) {
        return {
          success: false,
          message: 'order not found'
        }
        // throw new NotFoundException(`Order with ID ${orderId} not found.`);
      }
      return order;
    } catch (error) {
      console.error(error)
    }
  }
  public async changeOrderStatus(data: any){
    try {
      const { orderStatusGet, orderIdGet} = data;
      const currentOrderCheck = await this.orderRepository.findOne({ where: { id: orderIdGet } });
      if (!currentOrderCheck) {
        throw new NotFoundException(`Order with ID ${orderIdGet} not found.`);
      }
      const { status, itemId, quantity } = currentOrderCheck;
      if (status !== 'cancelled'){
        if(orderStatusGet === 'cancelled'){
          const updatedOrder = await this.orderRepository
              .createQueryBuilder()
              .update(Order) // Replace with your actual entity name if different
              .set({ status: orderStatusGet })
              .where("id = :orderIdGet", { orderIdGet })
              .returning("*") // Ensures the updated document is returned
              .execute();

          const updatedDocument = updatedOrder.raw[0]; // Get the updated document

          if (!updatedDocument) {
            throw new NotFoundException(`Order with ID ${orderIdGet} not found.`);
          }
          this.clientOrderForStock.emit('order_cancel_status_back_to_stock_service_queue', {itemId, quantity})
          // this.amqpConnection.publish('order-cancel-stock-back', 'order-cancel-stock-back-route', { type: 'order-cancel-stock-back-type', data: { itemId, quantity } });
        } else {
          const updatedOrder = await this.orderRepository
              .createQueryBuilder()
              .update(Order)
              .set({ status: orderStatusGet })
              .where("id = :orderIdGet", { orderIdGet })
              .returning("*")
              .execute();
          const updatedDocument = updatedOrder.raw[0]; // Get the updated document
          if (!updatedDocument) {
            throw new NotFoundException(`Order with ID ${orderIdGet} not found.`);
          }
        }
      } else {
        console.log("update isn't possible")
      }
    } catch (e) {
      console.error(e)
    }
  }
}