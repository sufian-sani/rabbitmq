import {createParamDecorator, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {ClientProxy, RmqRecordBuilder} from "@nestjs/microservices";
import {timeout} from "rxjs";
import { CheckService } from './check.service';


// @Injectable()
// class checkService {
//     constructor(
//         @Inject('CHECK_AUTH_SERVICE') private userCheckService: ClientProxy,
//     ){}
//
//     async sendService(token: string){
//         const pattern = { cmd: 'check_user' };
//         const record = new RmqRecordBuilder('')
//             .setOptions({
//                 headers: {
//                     ['Authorization']: `Bearer ${token}`,
//                 },
//             })
//             .build();
//         return this.userCheckService.send(pattern, record)
//             .pipe(
//                 timeout(3000)
//             )
//             .toPromise()
//             .then(response => {
//                 return response;
//             })
//             .catch(err =>{
//                 if (err.name === 'TimeoutError'){
//                     console.error('Request timed out, but sending success response');
//                     return { success: true, message: 'Request timed out, but considered successful'}
//                 }
//             })
//     }
// }

export const CheckUser = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // const headers = request.headers;
        const authHeader = request.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const checkService: CheckService = request.checkService;
        if (!checkService) {
            throw new Error('CheckService not available in request context');
        }
        // const isUser = await checkService.sendService(token);
        //
        // return isUser;
        try {
            const isUser = await checkService.sendService(token);
            return isUser;
        } catch (err) {
            if (err instanceof UnauthorizedException) {
                throw new UnauthorizedException('This token is invalid');
            }
            throw err;
        }
    }
);
