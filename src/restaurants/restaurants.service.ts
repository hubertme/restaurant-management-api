import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EnumISOCountry from 'consts/enum/iso_countries';
import { Repository } from 'typeorm';
import Restaurant from './entities/restaurants.entity';
import { CreateRestaurantRequest } from './restaurants.models';
import RestaurantAddress from './entities/restaurant_address.entity';
import RestaurantOwner from './entities/restaurant_owner.entity';
import Account from 'src/accounts/entities/account.entity';

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

        @InjectRepository(RestaurantOwner)
        private ownerRepository: Repository<RestaurantOwner>,

        @InjectRepository(Account)
        private accountRepo: Repository<Account>,
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

    async createNewRestaurant(accountId: number, request: CreateRestaurantRequest): Promise<Restaurant> {
        let newResto = this.restoRepository.create();
        let addr = this.addressRepository.create();
        let owner = this.ownerRepository.create();

        // Fetch account
        const account = await this.accountRepo.findOne(accountId);
        
        // Inject address
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

        // Inject owner
        owner.firstName = request.ownerFName;
        owner.lastName = request.ownerLName;
        owner = await owner.save();

        newResto.businessName = request.businessName;
        newResto.legalName = request.legalName;
        newResto.address = addr;
        newResto.owner = owner;
        newResto.account = account;
        newResto = await newResto.save();

        return newResto;
    }
}
