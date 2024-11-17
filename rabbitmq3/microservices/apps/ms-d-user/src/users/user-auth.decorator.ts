import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service'; // Adjust the path to your AuthService

export const UserAuthCheck = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext) => {
        const context = ctx.switchToRpc().getContext<RmqContext>(); // For RabbitMQ context (if you use it)
        const headers = context.getMessage().properties.headers;
        const token = headers['Authorization']?.split(' ')[1]; // Extract Bearer token

        if (!token) {
            throw new Error('Authorization token missing in headers');
        }

        // Validate token and get the user
        const authService: AuthService = ctx.switchToHttp().getRequest().app.get(AuthService); // Get AuthService instance
        const user = await authService.validateUserByToken(token); // Validate the token using AuthService

        if (!user) {
            throw new Error('Invalid or expired token');
        }

        return user; // Return user if valid
    },
);