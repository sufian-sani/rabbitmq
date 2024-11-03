import { AmqpConnection,RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";

@Injectable()
export class StockConfirmationMessageService {
    constructor(
        // @Inject('STOCK_MODEL') private stockModel: Model<Stock>,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    // @RabbitSubscribe({
    //     exchange: 'stock-response-product',
    //     routingKey: 'stock-product-response-route',
    //     queue: 'stock-product-response-route-queue', // Ensure the queue name is unique for this consumer
    // })

    // async stockConfirmationMessage(data: any){
    //     // console.log(data)
    //     await this.amqpConnection.publish('stock-response-product', 'stock-product-response-route', {
    //         type: 'check_product_stock_availability',
    //         data // Send the stock data as the message payload
    //     });
    // }
}
