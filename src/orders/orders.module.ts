import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusModule } from 'src/menus/menus.module';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import Order from './entities/order.entity';
import OrderItem from './entities/order_item.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    // RestaurantsModule,
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
    ]),
    RestaurantsModule,
    MenusModule,
  ],
  exports: [TypeOrmModule],
})
export class OrdersModule {}
