import {Controller, Get, Inject} from '@nestjs/common';
import { MsAStockService } from './ms-a-stock.service';
import {ClientProxy, EventPattern, MessagePattern, Payload} from '@nestjs/microservices';

@Controller()
export class MsAStockController {
  constructor(
      private readonly msAStockService: MsAStockService
  ) {}

  @MessagePattern({ cmd: 'stock_check' })
  async handleCheckStock(@Payload() data: any) {
    const stockData = await this.msAStockService.checkStock()
    return stockData;
  }

  @MessagePattern({ cmd: 'stock_create' })
  async handleCreateStock(@Payload() data: any) {
    const ceateStock = await this.msAStockService.createStock(data)
    return ceateStock;
  }

  @MessagePattern({ cmd: 'check_quentity' })
  async handleCheckQuentity(@Payload() data: any) {
    const quentityAvailable = await this.msAStockService.checkQuentity(data)
    return quentityAvailable;
  }

  @EventPattern('order_cancel_status_back_to_stock_service_queue')
  async handleCancelStatusBackToStockService(@Payload() data: any) {
    this.msAStockService.handleStockBackService(data)
  }

}
