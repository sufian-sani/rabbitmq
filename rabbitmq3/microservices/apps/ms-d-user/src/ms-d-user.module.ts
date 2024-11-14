import { Module } from '@nestjs/common';
import { MsDUserController } from './ms-d-user.controller';
import { MsDUserService } from './ms-d-user.service';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',  // Adjust if necessary
      port: 5432,         // Default PostgreSQL port
      username: 'ms-holder',  // Your PostgreSQL username
      password: '123456',  // Your PostgreSQL password
      database: 'users',  // Your PostgreSQL database name
      entities: [User],  // Where TypeORM will look for your entities
      synchronize: true,  // Set to true for development (caution in production)
    }),
      UsersModule],
  controllers: [MsDUserController],
  providers: [MsDUserService],
})
export class MsDUserModule {}
