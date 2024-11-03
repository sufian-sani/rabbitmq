import { NestFactory } from '@nestjs/core';
// import {AppModule} from "../../microservices/src/app.module";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {MsBDeliveryModule} from "./ms-b-delivery.module";


async function bootstrap() {
  const app = await NestFactory.create(MsBDeliveryModule, {});
  await app.listen((3002));
}

bootstrap();
