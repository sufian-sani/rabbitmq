import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { Order } from '../schemas/order.entity';
import {DataSource, Repository} from "typeorm";
// import {SendOrderDetailsService} from "./send-order-details-service";

@Injectable()
export class OrderStatusCheck {
    private orderRepository: Repository<Order>;
    constructor(
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        private readonly amqpConnection: AmqpConnection,
        // private sendOrderDetailsService: SendOrderDetailsService
    ) {
        this.orderRepository = this.dataSource.getRepository(Order);
    }

    @RabbitSubscribe({
        exchange: 'order-status-check',
        routingKey: 'order-status-check-route',
        queue: 'order-status-check-route-queue',
    })
    async handleOrderStatusCheck(data: any) {
        try {
            if (data.type === 'order-status-check') {
                let orderId: string;

                // Check if orderId is directly present or wrapped inside another object
                if (typeof data.orderId === 'string') {
                    orderId = data.orderId; // Format 1: { type: 'order-status-check', orderId: '...' }
                } else if (data.orderId && typeof data.orderId.orderId === 'string') {
                    orderId = data.orderId.orderId; // Format 2: { orderId: { orderId: '...' } }
                } else {
                    console.error('Invalid orderId format:', data);
                    throw new Error('Invalid orderId format received');
                }

                if (orderId) {
                    const orderDetails = await this.orderGetFromDatabase(orderId)
                    if(orderDetails) {
                        const {status, id} = orderDetails;
                        const orderDetailsInfo = {status, orderId: id}
                        this.amqpConnection.publish('send-order-detail-service', 'send-order-detail-service-route', {
                            type: 'send_order_details_service',
                            orderDetailsInfo // Send the stock data as the message payload
                        });
                    }
                }
            }
        } catch (error){
            console.error(error)
        }
    }
    public async orderGetFromDatabase(orderId: string): Promise<Order> {
        try {
            const order = await this.orderRepository.findOne({ where: { id: orderId } });
            if (!order) {
                throw new NotFoundException(`Order with ID ${orderId} not found.`);
            }
            return order;
        } catch (error) {
            console.error(error)
        }
    }
}
