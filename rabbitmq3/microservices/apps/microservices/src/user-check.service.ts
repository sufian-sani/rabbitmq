// import { Injectable } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { Inject } from '@nestjs/common';
// import { Observable } from 'rxjs';
//
// @Injectable()
// export class UserCheckService {
//     constructor(
//         @Inject('CHECK_AUTH_SERVICE') private client: ClientProxy,
//     ) {}
//
//     send(pattern: any, record: any): Observable<any> {
//         return this.client.send(pattern, record);
//     }
// }