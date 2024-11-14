import {Body, Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Register route
    @Post('register')
    async register(@Body() body: { username: string; password: string }) {
        const { username, password } = body;
        return await this.usersService.register(username, password);
    }

    // Login route
    @Post('login')
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
