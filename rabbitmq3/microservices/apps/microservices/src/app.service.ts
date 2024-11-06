import {HttpStatus, Inject, Injectable} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {timeout} from "rxjs";

@Injectable()
export class AppService {
  constructor(
      @Inject('MY_ECOM_SERVICE_ORDER') private clientOrder: ClientProxy,
  ) {}

  async createOrder(data) {
    const pattern = { cmd: 'order_create' };
    return this.clientOrder.send(pattern, data)
        .pipe(
            timeout(3000)
        )
        .toPromise()
        .then(response =>{
          return { status: HttpStatus.OK, success: true, data: response };
        })
        .catch(err => {
          if (err.name === 'TimeoutError') {
            console.error('Request timed out, but sending success response')
            return { status: HttpStatus.REQUEST_TIMEOUT, success: true, message: 'Request timed out, but considered successful' };
          }
        })
  }

}
