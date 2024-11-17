import {Body, Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {AuthService} from "./auth.service";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}

    // Register route
    // @Post('register')
    @MessagePattern({ cmd: 'create_user' })
    async register(@Body() body: { username: string; password: string }) {
        const { username, password } = body;
        return await this.usersService.register(username, password);
    }

    // Login route
    // @Post('login')
    @MessagePattern({ cmd: 'login_user' })
    async login(@Body() body: { username: string; password: string }) {
        const { username, password } = body;
        return await this.usersService.login(username, password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    // @MessagePattern({ cmd: 'check_user' })
    getProfile(@Request() req) {
        return req.user; // Contains userId and username from the token payload
    }

    // @UseGuards(JwtAuthGuard)
    @MessagePattern({ cmd: 'check_user' })
    async handleProfileCheck(@Payload() data: any, @Ctx() context: RmqContext) {
        const headers = context.getMessage().properties.headers;
        const token = headers['Authorization'];
        if (!token) {
            throw new Error('Authorization token missing in headers');
        }
        const user = await this.authService.validateUserByToken(token);
        // const authHeader = headers['Authorization'];
        return user;
    }
}
