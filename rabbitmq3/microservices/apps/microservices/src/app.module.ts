import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import { ClientsModule, Transport } from '@nestjs/microservices';
import {UserCheckService} from "./user-check.service";
import {AuthMiddleware} from "./check-user.middleware";
import {CheckUser} from "./check-auth.decorator";
import {CheckService} from "./check.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MY_ECOM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // Replace with your RabbitMQ server address
          queue: 'my_queue_main',             // Replace with your queue name
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'ORDER_STOCK_CHECK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'my_order_stock_check_queue', // The queue to both send to and listen from
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'MY_ECOM_SERVICE_ORDER',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'my_order_queue_main',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'DELIVERY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'deliver_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'DELIVERY_STATUS_CHANGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'deliver_status_change_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'REGISTER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'register_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'LOGIN_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'login_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'CHECK_AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'check_auth_queue',
          queueOptions: {
            durable: false,
          },
          exchange: 'check_auth_exchange',
          exchangeType: 'header',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, CheckService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}

// export class AppModule {}
