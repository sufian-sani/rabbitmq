import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';  // For password hashing

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    // Register user
    async register(username: string, password: string) {
        const userExists = await this.userRepository.findOneBy({ username });
        if (userExists) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password
        const newUser = this.userRepository.create({ username, password: hashedPassword });
        return await this.userRepository.save(newUser);
    }

    // Login user
    async login(username: string, password: string) {
        const user = await this.userRepository.findOneBy({ username });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        // Generate JWT token payload
        const payload = { username: user.username, sub: user.id };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            accessToken: token,
        };
    }
}
