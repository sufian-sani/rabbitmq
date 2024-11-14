import { Controller, Get } from '@nestjs/common';
import { MsDUserService } from './ms-d-user.service';

@Controller()
export class MsDUserController {
  constructor(private readonly msDUserService: MsDUserService) {}

  @Get()
  getHello(): string {
    return this.msDUserService.getHello();
  }
}
