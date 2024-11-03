import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { Deliver } from "../schemas/delivery.entity";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class GetOrderInfoFromOrderService {
    private deliverRepository: Repository<Deliver>;
    constructor(
        @Inject('DATA_SOURCE') private dataSource: DataSource,
    ) {
        this.deliverRepository = this.dataSource.getRepository(Deliver);
    }

    @RabbitSubscribe({
        exchange: 'send-order-detail-service',
        routingKey: 'send-order-detail-service-route',
        queue: 'send-order-detail-service-route-queue', // Ensure the queue name is unique for this consumer
    })
    async handleGetOrderInfoFromOrderService(data: any) {
        try {
            if (data.type === 'send_order_details_service') {
                const {status, orderId} = data.orderDetailsInfo
                const orderData = {
                    status,
                    orderId
                }
                if(!orderId) {
                    throw new NotFoundException('Order Not Found');
                }
                const newDelivery = this.deliverRepository.create(orderData);
                await this.deliverRepository.save(newDelivery);
            }
        } catch (error) {
            console.error(error)
        }
    }
}
