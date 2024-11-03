import { AmqpConnection,RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { Stock } from '../schemas/stock.entity';
import {DataSource, Repository} from "typeorm";

@Injectable()
export class StockCheckService {
    private stockRepository: Repository<Stock>;
    constructor(
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        private readonly amqpConnection: AmqpConnection,
    ) {
        this.stockRepository = this.dataSource.getRepository(Stock);
    }

    @RabbitSubscribe({
        exchange: 'stock-product',
        routingKey: 'stock-product-route',
        queue: 'stock-product-queue', // Ensure the queue name is unique for this consumer
    })
    async handleProductStockCheck(data: any) {
        try {
            if (data.type === 'check_stock_by_id') {
                const { itemId, quantity:mainQuantity } = data.data
                if (!itemId && !mainQuantity) {
                    throw new NotFoundException('error')
                }
                const stocks = await this.checkStock(itemId, parseInt(mainQuantity));

                if(!stocks) {
                    throw new Error('product stock does not exist');
                }
                const updatedStock = stocks.raw.map(({ stockId, quantity, name }) => {
                    return {
                        stockId,
                        quantity: mainQuantity,
                        name
                    }
                });
                const [infoStock] = updatedStock;
                await this.amqpConnection.publish('stock-response-product', 'stock-product-response-route', {
                    type: 'check_product_stock_availability',
                    infoStock
                });
            }
        } catch (e) {
            console.error(e)
        }
    }
    public async checkStock(stockId: string, quantity: number) {
        try {
            if (typeof quantity !== 'number' || quantity <= 0) {
                throw new Error(`Invalid quantity: ${quantity}. Must be a positive number.`);
            }
            // console.log(stockId, quantity);
            const stock = await this.stockRepository
                .createQueryBuilder()
                .update(Stock)
                .set({ quantity: () => `quantity - ${quantity}` })
                .where("stockId = :stockId AND quantity >= :quantity", { stockId, quantity })
                .returning("*")
                .execute();
            if (!stock) {
                throw new Error('stock error');
            }
            return stock;

        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    }
}
