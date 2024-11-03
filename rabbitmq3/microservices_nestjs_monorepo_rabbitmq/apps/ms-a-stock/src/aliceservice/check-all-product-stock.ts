import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { Stock } from '../schemas/stock.entity';
import {DataSource, Repository} from "typeorm";

@Injectable()
export class AllStockCheck {
    private stockRepository: Repository<Stock>;
    constructor(
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        private readonly amqpConnection: AmqpConnection,
    ) {
        this.stockRepository = this.dataSource.getRepository(Stock);
    }

    @RabbitSubscribe({
        exchange: 'stock-check',
        routingKey: 'stock-check-route',
        queue: 'stock-check-route-queue',
    })
    async handleAllStockCheck(data: any) {
        try {
            if (data.type === 'check_all_stock') {
                const allStocks = await this.checkStock();
                await this.amqpConnection.publish('all-stock-response', 'all-stock-response-route', {
                    type: 'all-stock-response-type',
                    allStocks // Send the stock data as the message payload
                });
            }
        } catch (error){
            console.error(error)
        }
    }
    public async checkStock(){
      try {
          const newStock = await this.stockRepository.find();
          return newStock;
      } catch (error) {
        console.error('Error fetching stocks:', error);
        throw error; // Rethrow or handle error as needed
      }
    }
}
