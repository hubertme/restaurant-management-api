import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsController } from './restaurants.controller';
import Restaurant from './entities/restaurants.entity';
import { RestaurantsService } from './restaurants.service';
import RestaurantAddress from './entities/restaurant_address.entity';
import RestaurantOwner from './entities/restaurant_owner.entity';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  imports: [
    TypeOrmModule.forFeature([
      Restaurant, 
      RestaurantAddress, 
      RestaurantOwner
    ]),
  ]
})
export class RestaurantsModule {
  
}
