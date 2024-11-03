import {Body, Controller, Get, Inject, Param, Post} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
      @Inject('MY_ECOM_SERVICE') private client1: ClientProxy,
      @Inject('MY_ECOM_SERVICE_ORDER') private clientOrder: ClientProxy,
      private readonly appService: AppService
  ) {}

  // stock
  @Get('check-stock')
  async checkStock() {
    const pattern = { cmd: 'stock_check' };
    return this.client1.send(pattern,{}).toPromise();
  }

  @Post('create-stock')
  async createStock(@Body() body: any) {
    const { stockId, quantity, name } = body; // Destructure body data
    const pattern = { cmd: 'stock_create' };
    return this.client1.send(pattern,{stockId, quantity, name}).toPromise();
  }

  // order
  @Post('order')
  async createOrder(@Body() body: any) {
    const { stockId, quantity } = body;
    const pattern = { cmd: 'order_create' };
    return this.clientOrder.send(pattern,{stockId, quantity}).toPromise();
  }

  // delivery
  @Get('check-delivery')
  async checkDelivery() {
    await this.appService.checkDelivery('jaffa-cake-monster');
  }
}
