import { Module } from '@nestjs/common';
import { databaseProviders } from './ms-b-delivery.database.provider';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class MsBDeliveryModelModule {}
