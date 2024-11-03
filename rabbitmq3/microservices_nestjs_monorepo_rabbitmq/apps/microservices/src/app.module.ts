import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AllStockCheckService} from "./Responservice/stock-consumer.service";
// import { StockConsumerService } from './Responservice/stock-consumer.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        { name: 'orders', type: 'topic' },
        { name: 'stock', type: 'topic' },
        { name: 'delivery', type: 'topic' },
        { name: 'stock-product', type: 'topic' },
        { name: 'stock-response-product', type: 'topic' },
        { name: 'order-status-check', type: 'topic' },
        { name: 'send-order-detail-service', type: 'topic' },
        { name: 'order-delivery', type: 'topic' },
        { name: 'order-delivery-status-change', type: 'topic' },
        { name: 'order-cancel-stock-back', type: 'topic' },
        { name: 'stock-check', type: 'topic' },
        { name: 'all-stock-response', type: 'topic' },
      ],
      uri: 'amqp://localhost:5672',
    }) as DynamicModule,  // <---- Explicit type cast
  ],
  controllers: [AppController],
  providers: [AppService, AllStockCheckService],
})
export class AppModule {}
