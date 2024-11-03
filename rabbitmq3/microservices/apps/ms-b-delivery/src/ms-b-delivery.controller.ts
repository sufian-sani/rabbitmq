import { Controller, Get } from '@nestjs/common';
import { MsBDeliveryService } from './ms-b-delivery.service';
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";

@Controller()
export class MsBDeliveryController {
  constructor(private readonly msBDeliveryService: MsBDeliveryService) { }
}
