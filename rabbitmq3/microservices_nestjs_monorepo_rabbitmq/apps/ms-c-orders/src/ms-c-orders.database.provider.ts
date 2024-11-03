import { DataSource } from 'typeorm';
import {Order} from "./schemas/order.entity";

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'ms-holder',
                password: '123456',
                database: 'orders',
                entities: [Order],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
