import {Inject, Injectable} from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import { Stock } from './schemas/stock.entity';
import { Repository, DataSource } from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class MsAStockService {
  private stockRepository: Repository<Stock>;
  constructor(
      @Inject('DATA_SOURCE') private dataSource: DataSource,
  ) {
    this.stockRepository = this.dataSource.getRepository(Stock);
  }

  @RabbitSubscribe({
    exchange: 'stock',
    routingKey: 'stock-route',
    queue: 'stock-queue',
  })

  public async pubSubHandler(data: any) {
    try {
      await this.createStock(data.data)
    } catch (error) {
      console.error(error);
    }
  }
  public async createStock(data) {
    try {
      const newStock = this.stockRepository.create(data);
      console.log(newStock);
      return await this.stockRepository.save(newStock);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
