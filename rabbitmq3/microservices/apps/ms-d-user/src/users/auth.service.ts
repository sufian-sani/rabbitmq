import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity'; // Import the user entity
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UsersService} from "./users.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>, // Inject the User repository
        private jwtService: JwtService, // Inject the JwtService to handle JWT operations
    ) {}
    // Method to validate the user by token
    async validateUserByToken(authHeader: string) {
        try {
            const token = authHeader.replace('Bearer ', '');
            // Decode and verify the JWT token
            const decodedToken = this.jwtService.verify(token); // Will throw an error if the token is invalid

            // Use the decoded token to find the user in the database
            const user = await this.userRepository.findOne({ where: { id: decodedToken.sub } });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            return user; // Return the user if valid
        } catch (error) {
            // If token is invalid, or user is not found, throw an UnauthorizedException
            // throw new UnauthorizedException('Invalid or expired token');
            return "Invalid or expired token"
        }
    }
}