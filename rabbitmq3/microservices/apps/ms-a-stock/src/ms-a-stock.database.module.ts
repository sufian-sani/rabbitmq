import { Module } from '@nestjs/common';
import { databaseProviders } from './ms-a-stock.database.provider';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class MsAStockDatabaseModule {}
