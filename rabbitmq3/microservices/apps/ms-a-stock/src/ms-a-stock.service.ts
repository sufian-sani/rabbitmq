import {Inject, Injectable} from '@nestjs/common';
// import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import { Stock } from './schemas/stock.entity';
import { Repository, DataSource } from 'typeorm';
import {InjectRepository} from "@nestjs/typeorm";
import {MessagePattern} from "@nestjs/microservices";

@Injectable()
export class MsAStockService {
  private stockRepository: Repository<Stock>;
  constructor(
      @Inject('DATA_SOURCE') private dataSource: DataSource,
  ) {
    this.stockRepository = this.dataSource.getRepository(Stock);
  }

  public async checkStock(){
    const newStock = await this.stockRepository.find();
    return newStock;
  }

  public async createStock(data) {
    try {
      const newStock = this.stockRepository.create(data);
      return await this.stockRepository.save(newStock);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async checkQuentity(data) {
    try {
      const { stockId, quantity } = data;
      if (typeof quantity !== 'number' || quantity <= 0) {
        throw new Error(`Invalid quantity: ${quantity}. Must be a positive number.`);
      }
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

    } catch (e) {
      console.error(e);
    }
  }
  public async handleStockBackService(data){
    try {
      const { itemId,quantity } = data
      const stock = await this.stockRepository
          .createQueryBuilder()
          .update(Stock)
          .set({ quantity: () => `quantity + ${quantity}` })
          .where("stockId = :itemId AND quantity >= 0", { itemId, quantity })
          .returning("*")
          .execute();
    } catch (error) {
      console.error(error);
    }
  }
}
