import { DataSource } from 'typeorm';
import {Stock} from "./schemas/stock.entity";

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
                database: 'stock',
                entities: [Stock],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
