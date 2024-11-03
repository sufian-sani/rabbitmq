import { AmqpConnection,RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { Stock } from '../schemas/stock.entity';
import {DataSource, Repository} from "typeorm";
// import {StockConfirmationMessageService} from "./stock-confirmation-message";

@Injectable()
export class StockBackService {
    private stockRepository: Repository<Stock>;
    constructor(
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        private readonly amqpConnection: AmqpConnection,
    ) {
        this.stockRepository = this.dataSource.getRepository(Stock);
    }

    @RabbitSubscribe({
        exchange: 'order-cancel-stock-back',
        routingKey: 'order-cancel-stock-back-route',
        queue: 'order-cancel-stock-back-route-queue', // Ensure the queue name is unique for this consumer
    })
    async handleStockBackService(data: any) {
        try {
            if (data.type === 'order-cancel-stock-back-type') {
                const { itemId,quantity } = data.data
                const stock = await this.stockRepository
                    .createQueryBuilder()
                    .update(Stock)
                    .set({ quantity: () => `quantity + ${quantity}` })
                    .where("stockId = :itemId AND quantity >= 0", { itemId, quantity })
                    .returning("*")
                    .execute();
                // const updatedStock = stock.raw[0];
            }
        } catch (e) {
            console.error(e)
        }
    }
}