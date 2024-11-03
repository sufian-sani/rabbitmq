import { Module } from '@nestjs/common';
import { MsAStockController } from './ms-a-stock.controller';
import { MsAStockService } from './ms-a-stock.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MsAStockDatabaseModule } from './ms-a-stock.database.module';

@Module({
  imports: [
    MsAStockDatabaseModule,
  ],
  controllers: [MsAStockController],
  providers: [
      MsAStockService,
  ],
})
export class MsAStockModule {}
