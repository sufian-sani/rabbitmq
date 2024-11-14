import { Injectable } from '@nestjs/common';

@Injectable()
export class MsDUserService {
  getHello(): string {
    return 'Hello World!!!!!!!!!!!!!';
  }
}
