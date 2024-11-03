import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    itemId: string;

    @Column('int')
    quantity: number;

    @Column({ type: 'varchar', default: 'pending' })
    status: string;
}