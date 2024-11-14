import { Test, TestingModule } from '@nestjs/testing';
import { MsDUserController } from './ms-d-user.controller';
import { MsDUserService } from './ms-d-user.service';

describe('MsDUserController', () => {
  let msDUserController: MsDUserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsDUserController],
      providers: [MsDUserService],
    }).compile();

    msDUserController = app.get<MsDUserController>(MsDUserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msDUserController.getHello()).toBe('Hello World!');
    });
  });
});
