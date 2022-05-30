import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import Menu from './entities/menu.entity';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

@Module({
  controllers: [MenusController],
  providers: [MenusService],
  imports: [
    TypeOrmModule.forFeature([
      Menu,
    ]),
    RestaurantsModule,
  ],
  exports: [TypeOrmModule]
})
export class MenusModule {}
