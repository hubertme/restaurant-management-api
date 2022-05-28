import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import AppConfig from './app_config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: AppConfig.envFilePath,
        }),
        TypeOrmModule.forRoot(),
        // TypeOrmModule.forRootAsync({
        //     useFactory: async () =>
        //       Object.assign(await getConnectionOptions(), {
        //         autoLoadEntities: true,
        //     }),
        // }),
        RestaurantsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
