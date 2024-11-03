import { Test, TestingModule } from '@nestjs/testing';
import { MsAStockController } from './ms-a-stock.controller';
import { MsAStockService } from './ms-a-stock.service';

describe('MicroserviceAController', () => {
  let microserviceAController: MsAStockController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsAStockController],
      providers: [MsAStockService],
    }).compile();

    microserviceAController = app.get<MsAStockController>(MsAStockController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(microserviceAController.getHello()).toBe('Hello World!');
    });
  });
});
