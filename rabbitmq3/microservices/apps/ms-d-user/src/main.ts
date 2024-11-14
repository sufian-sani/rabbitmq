import { NestFactory } from '@nestjs/core';
import { MsDUserModule } from './ms-d-user.module';

async function bootstrap() {
  const app = await NestFactory.create(MsDUserModule);
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
