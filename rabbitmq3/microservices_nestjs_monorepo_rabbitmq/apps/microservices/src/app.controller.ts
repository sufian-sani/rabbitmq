import {Body, Controller, Get, Param, Post, Res} from '@nestjs/common';
import { AppService } from './app.service';
// import { v4 as uuid } from 'uuid';
// import {EventPattern, MessagePattern} from '@nestjs/microservices';
import {AllStockCheckService} from "./Responservice/stock-consumer.service";
import {ClientProxy} from "@nestjs/microservices";
import { Response } from 'express';
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly allStockCheckService: AllStockCheckService,
    private readonly amqpConnection: AmqpConnection
  ) {}

  // stock
  @Get('check-stock')
  async checkStock(@Res() res: Response) {
    try {
      const pattern = { cmd: 'check_stock' };
      const payload = { type: 'all-stock-request-type' };
      const allData = await this.client.send(pattern, payload).toPromise();
      console.log('allData', allData);
      res.status(200).json({
        status: 'success',
        data: allData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message });
    }
    // await this.appService.checkStock();
    // await new Promise(resolve => setTimeout(resolve, 100));
    // const allData = await this.allStockCheckService.getStockData()
    // console.log('allData', allData)
    // return {
    //   status: 'success',
    //   data: allData,
    // };
  }

  @Get('create-stock')
  async createStock(@Body() body: any) {
    const { stockId, quantity, name } = body; // Destructure body data
    // console.log(stockId, quantity, name)
    await this.appService.createStock(stockId, quantity, name);
  }

  // order
  @Post('order')
  async createOrder(@Body() body: any) {
    const { stockId, quantity } = body;
    await this.appService.createOrder(stockId, quantity);
  }

  // check delivery
  @Get('check-delivery')
  async checkDelivery(@Body() body: any) {
    const id = body.id;
    await this.appService.checkDelivery(id);
  }

  @Post('change-delivery-status')
  async changeDeliveryStatus(
      @Body('deliver_status') deliver_status: string,
      @Body('orderDeliverId') orderDeliverId: string
  ) {
    await this.appService.changeDeliveryStatus(orderDeliverId, deliver_status);
  }
}
