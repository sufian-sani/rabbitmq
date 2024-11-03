import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { Order } from '../schemas/order.entity';
import {DataSource, Repository} from "typeorm";

@Injectable()
export class OrderStatusChange {
    private orderRepository: Repository<Order>;
    constructor(
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        private readonly amqpConnection: AmqpConnection,
    ) {
        this.orderRepository = this.dataSource.getRepository(Order);
    }

    @RabbitSubscribe({
        exchange: 'order-delivery-status-change',
        routingKey: 'order-delivery-status-change-route',
        queue: 'order-delivery-status-change-route-queue',
    })
    async handleOrderStatusChange(data: any) {
        try {
            if (data.type === 'order-status-change') {
                const {status, orderId} = data.data

                const currentOrderCheck = await this.orderRepository.findOne({ where: { id: orderId } });
                if (!currentOrderCheck) {
                    throw new NotFoundException(`Order with ID ${orderId} not found.`);
                }
                const { status:currentStatus, itemId, quantity } = currentOrderCheck;
                if (currentStatus !== 'cancelled'){
                    if(status === 'cancelled'){
                        const updatedOrder = await this.orderRepository
                            .createQueryBuilder()
                            .update(Order) // Replace with your actual entity name if different
                            .set({ status: status })
                            .where("id = :orderId", { orderId })
                            .returning("*") // Ensures the updated document is returned
                            .execute();

                        const updatedDocument = updatedOrder.raw[0]; // Get the updated document

                        if (!updatedDocument) {
                            throw new NotFoundException(`Order with ID ${orderId} not found.`);
                        }
                        this.amqpConnection.publish('order-cancel-stock-back', 'order-cancel-stock-back-route', { type: 'order-cancel-stock-back-type', data: { itemId, quantity } });
                    } else {
                        const updatedOrder = await this.orderRepository
                            .createQueryBuilder()
                            .update(Order)
                            .set({ status: status })
                            .where("id = :orderId", { orderId })
                            .returning("*")
                            .execute();
                        const updatedDocument = updatedOrder.raw[0]; // Get the updated document
                        if (!updatedDocument) {
                            throw new NotFoundException(`Order with ID ${orderId} not found.`);
                        }
                    }
                } else {
                    console.log("update isn't possible")
                }
            }
        } catch (error){
            console.error(error)
        }
    }

}
