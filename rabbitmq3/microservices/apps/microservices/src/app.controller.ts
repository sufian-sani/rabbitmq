import {Body, Controller, Get, HttpStatus, Inject, Param, Post, Headers} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import {timeout} from "rxjs";

@Controller()
export class AppController {
  constructor(
      @Inject('MY_ECOM_SERVICE') private client1: ClientProxy,
      @Inject('DELIVERY_SERVICE') private clientDelivery: ClientProxy,
      @Inject('DELIVERY_STATUS_CHANGE_SERVICE') private clientDeliveryStatus: ClientProxy,
      @Inject('REGISTER_SERVICE') private userRegisterService: ClientProxy,
      @Inject('LOGIN_SERVICE') private userLoginService: ClientProxy,
      private readonly appService: AppService
  ) {}

    //User
    // Register route
    @Post('users/register')
    async register(@Body() body: { username: string; password: string }) {
        const { username, password } = body;
        const pattern = { cmd: 'create_user' };
        return this.userRegisterService.send(pattern,{username, password})
            .pipe(
                timeout(2000)
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

    // Login route
    @Post('users/login')
    async login(@Body() body: { username: string; password: string }){
      const { username, password } = body;
      const pattern = { cmd: 'login_user' };
        return this.userLoginService.send(pattern,{username, password})
            .pipe(
                timeout(2000)
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

    @Get('users/auth')
    async checkAuth(@Headers('Authorization') authHeader: string){
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            throw new Error('Authorization token missing');
        }
        console.log('checkAuth', token)
    }

  // stock
  @Get('check-stock')
  async checkStock() {
    const pattern = { cmd: 'stock_check' };
    return this.client1.send(pattern,{})
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

  @Post('create-stock')
  async createStock(@Body() body: any) {
    const { stockId, quantity, name } = body; // Destructure body data
    const pattern = { cmd: 'stock_create' };
    return this.client1.send(pattern,{stockId, quantity, name})
        .pipe(
            timeout(2000)
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

  // order
  @Post('order')
  async createOrder(@Body() body: any) {
    return this.appService.createOrder(body)
  }

  // delivery
  @Get('check-delivery')
  async checkDelivery(@Body() body: any) {
    const id = body.id;
    const pattern = { cmd: 'check_delivery_order' };
    return this.clientDelivery.send(pattern,id)
        .pipe(
            timeout(1000)
        )
        .toPromise()
        .then(response => {
          return { status: HttpStatus.OK, success: true, data: response };
        })
        .catch(err => {
          console.error('Request timed out')
          return { status: HttpStatus.REQUEST_TIMEOUT, success: true, message: 'Request timed out' };
        })
  }

  @Post('change-delivery-status')
  async changeDeliveryStatus(@Body() body: any) {
    const pattern = { cmd: 'delivery_status_change_pattern' };
    return this.clientDeliveryStatus.send(pattern,body)
        .pipe(
            timeout(2000)
        )
        .toPromise()
        .then(response => {
          return { status: HttpStatus.OK, success: true, data: response };
        })
        .catch(err => {
          console.error('Request timed out, but sending success response')
          return { status: HttpStatus.REQUEST_TIMEOUT, success: true, message: 'Request timed out, but signal send' };
        })
  }
}
