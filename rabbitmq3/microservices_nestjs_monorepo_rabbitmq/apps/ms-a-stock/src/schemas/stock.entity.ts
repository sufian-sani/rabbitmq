// import * as mongoose from 'mongoose';
//
// export const StockEntity = new mongoose.Schema({
//   stockId: String,
//   quantity: Number,
//   name: String,
// });

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
