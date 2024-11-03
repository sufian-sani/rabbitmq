import { AmqpConnection,RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';

@Injectable()
export class SendOrderDetailsService {
    constructor(
        private readonly amqpConnection: AmqpConnection,
    ) {}

    // @RabbitSubscribe({
    //     exchange: 'send-order-detail-service',
    //     routingKey: 'send-order-detail-service-route',
    //     queue: 'send-order-detail-service-route-queue', // Ensure the queue name is unique for this consumer
    // })

    //  handlerSendOrderDetailsService(data: any){
    //      this.amqpConnection.publish('send-order-detail-service', 'send-order-detail-service-route', {
    //         type: 'send_order_details_service',
    //         data // Send the stock data as the message payload
    //     });
    // }
}
