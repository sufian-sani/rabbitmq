import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
            ignoreExpiration: false,
            secretOrKey: '123456abc', // Secret key to validate the JWT
        });
    }

    async validate(payload: any) {
        const user = await this.userRepository.findOneBy({ id: payload.sub });
        return user; // Return user if the token is valid
    }
}