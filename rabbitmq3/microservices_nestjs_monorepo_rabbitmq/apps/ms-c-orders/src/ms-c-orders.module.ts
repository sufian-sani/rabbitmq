import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, DynamicModule } from '@nestjs/common';
import { MsCOrdersController } from './ms-c-orders.controller';
// import { databaseProviders } from './ms-c-orders.database.provider';
import { MsCOrdersService } from './ms-c-orders.service';
// import {modelProviders} from "./ms-c-orders.database.module";
// import {StockCheckByServiceService} from "./aliceservice/productstock-check.service";
import {StockCheckResponse} from "./aliceservice/product-stock-confirmation-message";
import {OrderStatusCheck} from "./aliceservice/order-status-check";
import {SendOrderDetailsService} from "./aliceservice/send-order-details-service";
import {OrderStatusChange} from "./aliceservice/get-order-status-change";
import {MsCOrdersDatabaseModule} from "./ms-c-orders.database.module";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'orders',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
    }) as DynamicModule,
    MsCOrdersDatabaseModule,
  ],
  controllers: [MsCOrdersController],
  providers: [
    MsCOrdersService,
    // StockCheckByServiceService,
    StockCheckResponse,
    OrderStatusCheck,
    // SendOrderDetailsService,
    OrderStatusChange,
  ],
})
export class MsCOrdersModule { }

