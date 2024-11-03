import { Module,DynamicModule } from '@nestjs/common';
import { MsAStockController } from './ms-a-stock.controller';
import { MsAStockService } from './ms-a-stock.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { databaseProviders } from './ms-a-stock.database.provider';
// import { modelProviders } from './ms-a-stock.model.provider';
import {StockCheckService} from "./aliceservice/check-product-stock.service";
import {StockConfirmationMessageService} from "./aliceservice/stock-confirmation-message";
import {StockBackService} from "./aliceservice/get-stock-back";
import {AllStockCheck} from "./aliceservice/check-all-product-stock";
import { TypeOrmModule } from '@nestjs/typeorm';
import {Stock} from "./schemas/stock.entity";
import { MsAStockDatabaseModule } from './ms-a-stock.database.module';

console.log(databaseProviders)
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'stock',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
    }) as DynamicModule,
    MsAStockDatabaseModule,
    // TypeOrmModule.forFeature([Stock])
  ],
  controllers: [MsAStockController],
  providers: [
    MsAStockService,
    StockCheckService,
    StockBackService,
    AllStockCheck,
  ],
})
export class MsAStockModule { }