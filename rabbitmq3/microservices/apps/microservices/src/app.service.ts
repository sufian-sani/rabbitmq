import {HttpStatus, Inject, Injectable} from '@nestjs/common';
import {ClientProxy, RmqRecordBuilder} from "@nestjs/microservices";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {timeout} from "rxjs";

@Injectable()
export class AppService {
  constructor(
      @Inject('MY_ECOM_SERVICE_ORDER') private clientOrder: ClientProxy,
      @Inject('ORDER_STOCK_CHECK_SERVICE') private client1: ClientProxy,
      @Inject('CHECK_AUTH_SERVICE') private userCheckService: ClientProxy,
  ) {}

  async createOrder(body) {
      const checkStock = await this.checkStockQuentity(body)
      if(checkStock.data.affected === 0 || (Array.isArray(checkStock.data.raw) && checkStock.data.raw.length === 0)){
          return {
              success: false,
              message: 'Stock not available of the product'
          }
      }
    const pattern = { cmd: 'order_create' };
    return this.clientOrder.send(pattern, body)
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

    public checkStockQuentity(data) {
        try {
            const pattern = { cmd: 'check_quentity' };
            return this.client1.send(pattern, data)
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
        } catch (error) {
            console.error(error);
        }
    }

    public checkUser(token:any) {
        if (!token) {
            throw new Error('Authorization token missing');
        }
        const pattern = { cmd: 'check_user' };
        const record = new RmqRecordBuilder('')
            .setOptions({
                headers: {
                    ['Authorization']: `Bearer ${token}`,
                },
            })
            .build();
        return this.userCheckService.send(pattern, record)
            .pipe(
                timeout(3000)
            )
            .toPromise()
            .then(response => {
                return response;
            })
            .catch(err =>{
                if (err.name === 'TimeoutError'){
                    console.error('Request timed out, but sending success response');
                    return { success: true, message: 'Request timed out, but considered successful'}
                }
            })
    }

}
