import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { Deliver } from "../schemas/delivery.entity";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class OrderDeliveryStatus {
    private deliverRepository: Repository<Deliver>;
    constructor(
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        private readonly amqpConnection: AmqpConnection,
        // private sendOrderDetailsService: SendOrderDetailsService
    ) {
        this.deliverRepository = this.dataSource.getRepository(Deliver);
    }

    @RabbitSubscribe({
        exchange: 'order-delivery',
        routingKey: 'order-delivery-route',
        queue: 'order-delivery-route-queue',
    })
    async handleOrderDeliveryStatus(data: any) {
        try {
            if (data.type === 'order-delivery-status') {
                const {orderDeliverId,deliver_status} = data.data.orderDeliveryDetails
                const checkOrderDeliveryCondition = await this.handelCheckOrderDeliveryCondition(
                    orderDeliverId,
                    deliver_status
                )
                console.log('checkOrderDeliveryCondition', checkOrderDeliveryCondition);
            }
        } catch (error){
            console.error(error)
        }
    }
    async handelCheckOrderDeliveryCondition(orderDeliverId: any, deliver_status: any){
        try {
            const orderDeliver = await this.deliverRepository.findOne({ where: { id: orderDeliverId } });
            if (!orderDeliver) {
                throw new NotFoundException(`Order Deliver with ID ${orderDeliverId} not found.`);
            }
            if (orderDeliver.status === deliver_status) {
                return 'delivery status already exsist'
            } else if (orderDeliver.status === 'cancelled'){
                return 'order delivery status already cancelled, not able to update'
            }
            if(deliver_status==='inprocess'){
                const updatedDeliveryOrder = await this.handelChangeStatus(orderDeliverId, deliver_status)
                const { status, orderId } = updatedDeliveryOrder;
                this.amqpConnection.publish('order-delivery-status-change', 'order-delivery-status-change-route', { type: 'order-status-change', data: { status, orderId } });
            } else if(deliver_status==='pending'){
                const updatedDeliveryOrder = await this.handelChangeStatus(orderDeliverId, deliver_status)
                const { status, orderId } = updatedDeliveryOrder;
                this.amqpConnection.publish('order-delivery-status-change', 'order-delivery-status-change-route', { type: 'order-status-change', data: { status, orderId } });
            } else if(deliver_status==='shipped'){
                const updatedDeliveryOrder = await this.handelChangeStatus(orderDeliverId, deliver_status)
                const { status, orderId } = updatedDeliveryOrder;
                this.amqpConnection.publish('order-delivery-status-change', 'order-delivery-status-change-route', { type: 'order-status-change', data: { status, orderId } });
            } else if(deliver_status==='cancelled'){
                const updatedDeliveryOrder = await this.handelChangeStatus(orderDeliverId, deliver_status)
                const { status, orderId } = updatedDeliveryOrder;
                this.amqpConnection.publish('order-delivery-status-change', 'order-delivery-status-change-route', { type: 'order-status-change', data: { status, orderId } });
            }

            return true
        } catch (error){
            console.error(error)
        }
    }
    async handelChangeStatus(orderDeliverId: any, deliver_status: any){
        const updatedDeliveryOrder = await this.deliverRepository.createQueryBuilder()
            .update(Deliver) // Replace with your entity name
            .set({ status: deliver_status })
            .where("id = :orderDeliverId", { orderDeliverId })
            .returning("*") // Returns the updated document
            .execute();
        const updatedOrder = updatedDeliveryOrder.raw[0];
        if (!updatedOrder) {
            throw new NotFoundException(`Order with ID ${orderDeliverId} not found.`);
        }
        return updatedOrder;
    }
}
