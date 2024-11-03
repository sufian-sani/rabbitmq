import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { Order } from '../schemas/order.entity';
import {DataSource, Repository} from "typeorm";


@Injectable()
export class StockCheckResponse {
    private orderRepository: Repository<Order>;
    constructor(
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        private readonly amqpConnection: AmqpConnection,
    ) {
        this.orderRepository = this.dataSource.getRepository(Order);
    }

    @RabbitSubscribe({
        exchange: 'stock-response-product',
        routingKey: 'stock-product-response-route',
        queue: 'stock-product-response-route-queue', // Ensure the queue name is unique for this consumer
    })
    async handleStockProductGetMessage(data: any) {
        try {
            if (data.type === 'check_product_stock_availability') {
                const { stockId, quantity } = data.infoStock
                const productData = {
                    itemId: stockId,
                    quantity
                }
                const newOrder = this.orderRepository.create(productData);
                await this.orderRepository.save(newOrder);
                // await new this.orderModel(productData).save();
            }
        } catch (error){
            console.error(error)
        }

    }
}
