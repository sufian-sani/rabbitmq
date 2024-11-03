import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { AppService } from './app.service';
import { v4 as uuid } from 'uuid'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // stock
  @Get('check-stock')
  async checkStock() {
    await this.appService.checkStock('jaffa-cake', 1);
  }

  @Post('create-stock')
  async createStock(@Body() body: any) {
    const { stockId, quantity, name } = body; // Destructure body data
    // console.log(stockId, quantity, name)
    await this.appService.createStock(stockId, quantity, name);
  }

  @Get('order')
  async createOrder() {
    await this.appService.createOrder('jaffa-cake-monster', 'jaffa-cake', 1);
  }

  @Get('check-delivery')
  async checkDelivery() {
    await this.appService.checkDelivery('jaffa-cake-monster');
  }
}
