import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EnumISOCountry from 'consts/enum/iso_countries';
import { Repository } from 'typeorm';
import Restaurant from './entities/restaurants.entity';
import { CreateRestaurantRequest } from './restaurants.models';
import RestaurantAddress from './entities/restaurant_address.entity';

class ErrorMessage {
    static readonly NO_RESTAURANT_FOUND = 'err/restaurant/no-restaurant-found';
}

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectRepository(RestaurantAddress)
        private addressRepository: Repository<RestaurantAddress>,

        @InjectRepository(Restaurant)
        private restoRepository: Repository<Restaurant>,
    ){}

    async getAllRestaurants(): Promise<Restaurant[]> {
        const result = await this.restoRepository.find();
        return result;
    }

    async getSingleRestaurantById(id: number): Promise<Restaurant> {
        const result = await this.restoRepository.findByIds([id]);
        if (!result || result.length === 0) {
            throw ErrorMessage.NO_RESTAURANT_FOUND;
        }
        return result[0];
    }

    async createNewRestaurant(request: CreateRestaurantRequest): Promise<Restaurant> {
        let newResto = this.restoRepository.create();
        let addr = this.addressRepository.create();
        
        // Inject all data
        addr.addLine1 = request.addLine1;
        addr.addLine2 = request.addLine2;
        addr.district = request.district;
        addr.subdistrict = request.subdistrict;
        addr.province = request.province;
        addr.city = request.city;
        addr.countryISO = EnumISOCountry.INDONESIA;
        addr.latitude = request.latitude;
        addr.longitude = request.longitude;
        addr = await addr.save();

        newResto.businessName = request.businessName;
        newResto.legalName = request.legalName;
        newResto.address = addr;
        newResto = await newResto.save();

        return newResto;
    }
}
