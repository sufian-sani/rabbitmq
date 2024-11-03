import { Module } from '@nestjs/common';
import { databaseProviders } from './ms-c-orders.database.provider';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class MsCOrdersDatabaseModule {}
