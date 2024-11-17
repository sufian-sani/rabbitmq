import {createParamDecorator, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {ClientProxy, RmqRecordBuilder} from "@nestjs/microservices";
import {timeout} from "rxjs";
import { CheckService } from './check.service';


export const CheckUser = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // const headers = request.headers;
        try {
            const authHeader = request.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const checkService: CheckService = request.checkService;
            if (!checkService) {
                throw new Error('CheckUserService not available in request context');
            }
            const isUser = await checkService.sendService(token);
            return isUser;
        } catch (error) {
            return error;
        }
        // const authHeader = request.headers['authorization'];
        // const token = authHeader && authHeader.split(' ')[1];
        // const checkService: CheckService = request.checkService;
        // if (!checkService) {
        //     throw new Error('CheckService not available in request context');
        // }
        // const isUser = await checkService.sendService(token);
        //
        // return isUser;
        // try {
        //     const isUser = await checkService.sendService(token);
        //     return isUser;
        // } catch (err) {
        //     if (err instanceof UnauthorizedException) {
        //         throw new UnauthorizedException('This token is invalid');
        //     }
        //     throw err;
        // }
    }
);
