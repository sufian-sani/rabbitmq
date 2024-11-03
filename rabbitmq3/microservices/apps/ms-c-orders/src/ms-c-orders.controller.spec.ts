import { Test, TestingModule } from '@nestjs/testing';
import { MsCOrdersController } from './ms-c-orders.controller';
import { MsCOrdersService } from './ms-c-orders.service';

describe('MicroserviceCController', () => {
  let microserviceCController: MsCOrdersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsCOrdersController],
      providers: [MsCOrdersService],
    }).compile();

    microserviceCController = app.get<MsCOrdersController>(MsCOrdersController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(microserviceCController.getHello()).toBe('Hello World!');
    });
  });
});
