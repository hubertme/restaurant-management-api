import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import AppConfig from './app_config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusModule } from './menus/menus.module';
import { AccountsModule } from './accounts/accounts.module';
import { Connection } from 'typeorm';
import AuthenticateUserMiddleware from 'middlewares/authentication.middleware';

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
        RestaurantsModule,
        MenusModule,
        AccountsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule  {
    constructor(private connection: Connection) {}

    configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthenticateUserMiddleware).forRoutes(
            '/restaurants', 
            '/menus',
        );
	}
}
