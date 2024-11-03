import { AmqpConnection,RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { Deliver } from "../schemas/delivery.entity";
import {DataSource, Repository} from "typeorm";

@Injectable()
export class StatusFromOrderService {
    private deliverRepository: Repository<Deliver>;
    constructor(
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        private readonly amqpConnection: AmqpConnection,
    ) {
        this.deliverRepository = this.dataSource.getRepository(Deliver);
    }

    @RabbitSubscribe({
        exchange: 'order-status-check',
        routingKey: 'order-status-check-route',
        queue: 'order-status-check-route-queue', // Ensure the queue name is unique for this consumer
    })

    async checkStatusFromOrderService(orderId: any){
        const orderCheck = await this.deliverRepository.findOneBy({ orderId });
        if (!orderCheck) {
            this.amqpConnection.publish('order-status-check', 'order-status-check-route', { type: 'order-status-check', orderId });
        }
    }
}
