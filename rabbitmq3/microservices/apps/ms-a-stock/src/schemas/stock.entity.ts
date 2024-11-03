import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    stockId: string;

    @Column()
    quantity: number;

    @Column()
    name: string;
}
