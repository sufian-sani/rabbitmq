import {Body, Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {MessagePattern} from "@nestjs/microservices";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

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
    getProfile(@Request() req) {
        return req.user; // Contains userId and username from the token payload
    }
}
