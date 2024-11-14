// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;  // The unique ID of the user

    @Column()
    username: string;  // The username of the user

    @Column()
    password: string;  // The password (hashed, ideally)

    @Column({ default: true })
    isActive: boolean;  // Whether the user is active or not
}
