import { Test, TestingModule } from '@nestjs/testing';
import { MsBDeliveryController } from './ms-b-delivery.controller';
import { MsBDeliveryService } from './ms-b-delivery.service';

describe('MicroserviceBController', () => {
  let microserviceBController: MsBDeliveryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsBDeliveryController],
      providers: [MsBDeliveryService],
    }).compile();

    microserviceBController = app.get<MsBDeliveryController>(MsBDeliveryController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(microserviceBController.getHello()).toBe('Hello World!');
    });
  });
});
