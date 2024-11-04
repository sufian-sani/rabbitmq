import { DataSource } from 'typeorm';
import {Deliver} from "./schemas/delivery.entity";

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
                database: 'deliver',
                entities: [Deliver],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
