// import * as mongoose from 'mongoose';
//
// export const OrderEntity = new mongoose.Schema({
//   // customerId: String,
//   // orderDate: Date,
//   // items: Array, // [{stockId: "guid", qty: 5, name: "Jaffa Cake"}]
//   itemId: String,
//   quantity: Number,
//   status: { type: String, default: 'pending' }
// });

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