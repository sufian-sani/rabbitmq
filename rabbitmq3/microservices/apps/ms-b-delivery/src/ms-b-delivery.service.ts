import {HttpStatus, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
// import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import { Deliver } from "./schemas/delivery.entity";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class MsBDeliveryService {
  private deliverRepository: Repository<Deliver>;
  constructor(
      @Inject('DATA_SOURCE') private dataSource: DataSource,
      @Inject('ORDER_AVAILABILITY_CHECK') private clientOrder: ClientProxy,
      @Inject('ORDER_STATUS_CHANGE_SERVICE') private clientOrderStatus: ClientProxy,
  ) {
    this.deliverRepository = this.dataSource.getRepository(Deliver);
  }
  public async checkOrderDelivery(id:number) {
    try {
      const orderIdGet = id.toString();
      const checkDelivery = await this.deliverRepository.findOne({ where: { orderId: orderIdGet } });
      if(!checkDelivery){
        const idOrderAvailable = await this.checkOrderAvailability(id)
        if(idOrderAvailable.success === false){
          return { success: false, message: 'This order does not exist', status: HttpStatus.NOT_FOUND };
        }

        const { status, orderId } = idOrderAvailable
        const orderData = {
          status,
          orderId
        }
        const newDelivery = this.deliverRepository.create(orderData);
        return await this.deliverRepository.save(newDelivery);
      }
      return checkDelivery;
    } catch (err){
      console.error(err);
    }
  }
  public async checkOrderAvailability(id:number) {
    try {
      const pattern = { cmd: 'order_availability_check' };
      return this.clientOrder.send(pattern, id).toPromise();
    } catch (err){
      console.error(err);
    }
  }
  public async changeDeliveryStatus(data){
    try {
      const checkOrderDeliveryCondition = await this.handelCheckOrderDeliveryCondition(data)
      if(checkOrderDeliveryCondition.success === false){
        // throw new NotFoundException(`Order with ID ${orderDeliverId} not found.`);
        // console.log(checkOrderDeliveryCondition)
        return checkOrderDeliveryCondition
      }
      return {
        success: true,
        message: 'change signal send to order'
      }
    } catch (err){
      console.error(err)
    }
  }
  async handelCheckOrderDeliveryCondition(data:any){
    const {orderDeliverId, deliver_status} = data;
    try {
      if(!Number.isInteger(orderDeliverId)){
        return {
          success: false,
          message: 'order id must be an integer',
        }
      }
      const orderDeliver = await this.deliverRepository.findOne({ where: { id: orderDeliverId } });
      if (!orderDeliver) {
        // throw new NotFoundException(`Order Deliver with ID ${orderDeliverId} not found.`);
        return {
          success: false,
          message: 'order not found'
        }
      }
      if (orderDeliver.status === deliver_status) {
        // return 'delivery status already exsist'
        return {
          success: false,
          message: 'delivery status already exsist'
        }
      } else if (orderDeliver.status === 'cancelled'){
        // return 'order delivery status already cancelled, not able to update'
        return {
          success: false,
          message: 'order delivery status already cancelled, not able to update'
        }
      }
      let orderStatusGet=null;
      let orderIdGet=null;
      if(deliver_status==='inprocess'){
        const updatedDeliveryOrder = await this.handelChangeStatus(orderDeliverId, deliver_status)
        if(updatedDeliveryOrder.success === false){
          return updatedDeliveryOrder
        }
        const { status, orderId } = updatedDeliveryOrder;
        orderStatusGet = status
        orderIdGet = orderId
      } else if(deliver_status==='pending'){
        const updatedDeliveryOrder = await this.handelChangeStatus(orderDeliverId, deliver_status)
        if(updatedDeliveryOrder.success === false){
          return updatedDeliveryOrder
        }
        const { status, orderId } = updatedDeliveryOrder;
        orderStatusGet = status
        orderIdGet = orderId
      } else if(deliver_status==='shipped'){
        const updatedDeliveryOrder = await this.handelChangeStatus(orderDeliverId, deliver_status)
        if(updatedDeliveryOrder.success === false){
          return updatedDeliveryOrder
        }
        const { status, orderId } = updatedDeliveryOrder;
        orderStatusGet = status
        orderIdGet = orderId
      } else if(deliver_status==='cancelled'){
        const updatedDeliveryOrder = await this.handelChangeStatus(orderDeliverId, deliver_status)
        if(updatedDeliveryOrder.success === false){
          return updatedDeliveryOrder
        }
        const { status, orderId } = updatedDeliveryOrder;
        orderStatusGet = status
        orderIdGet = orderId
      }
      const data = {
        orderStatusGet,
        orderIdGet
      }
      this.clientOrderStatus.emit('order_status_change_pattern', data);
      return true
    } catch (error){
      console.error(error)
    }
  }

  async handelChangeStatus(orderDeliverId: any, deliver_status: any){
    try {
      const updatedDeliveryOrder = await this.deliverRepository.createQueryBuilder()
          .update(Deliver) // Replace with your entity name
          .set({ status: deliver_status })
          .where("id = :orderDeliverId", { orderDeliverId })
          .returning("*") // Returns the updated document
          .execute();
      const updatedOrder = updatedDeliveryOrder.raw[0];
      if (!updatedOrder) {
        return {
          success: false,
          message: 'Not found in delivery list'
        }
      }
      return updatedOrder;
    } catch (error){
      console.error(error)
    }
  }
}