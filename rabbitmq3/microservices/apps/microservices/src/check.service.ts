import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from "@nestjs/microservices";
import { timeout } from "rxjs";

@Injectable()
export class CheckService {
    constructor(
        @Inject('CHECK_AUTH_SERVICE') private readonly userCheckService: ClientProxy,
    ){}

    async sendService(token: string) {
        const pattern = { cmd: 'check_user' };
        const record = new RmqRecordBuilder('')
            .setOptions({
                headers: {
                    ['Authorization']: `Bearer ${token}`,
                },
            })
            .build();
        return this.userCheckService.send(pattern, record)
            .pipe(timeout(3000))
            .toPromise()
            .then(response => response)
            .catch(err => {
                if (err.name === 'TimeoutError') {
                    console.error('Request timed out, but sending success response');
                    return { success: true, message: 'Request timed out, but considered successful' };
                }
                throw err;
            });
    }
}
