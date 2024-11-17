import { Injectable, NestMiddleware } from '@nestjs/common';
import { CheckService } from './check.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly checkService: CheckService) {}

    use(req: any, res: any, next: () => void) {
        req.checkService = this.checkService;
        next();
    }
}
