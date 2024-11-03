import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Deliver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: string;

  @Column()
  status: string;
}
