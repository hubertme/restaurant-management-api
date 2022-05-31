import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EnumISOCurrency from 'consts/enum/iso_currencies';
import Account from 'src/accounts/entities/account.entity';
import Restaurant from 'src/restaurants/entities/restaurants.entity';
import { Repository } from 'typeorm';
import CommonMethodUtil from 'utils/common_util';
import Menu from './entities/menu.entity';

class ErrorMessage {
    static readonly NO_MENU_FOUND = 'err/menus/no-menu-found';
}

@Injectable()
export class MenusService {
    constructor(
        @InjectRepository(Menu)
        private menuRepo: Repository<Menu>,

        @InjectRepository(Restaurant)
        private restoRepo: Repository<Restaurant>,

        @InjectRepository(Account)
        private accountRepo: Repository<Account>,
    ) {}

    async getAllMenus(accountId: number, restoId: number): Promise<Menu[]> {
        const restaurant = await CommonMethodUtil.getRestaurantById(accountId, restoId);

        const menus = await this.menuRepo.find({where: {restaurant}});
        return menus;
    }

    async addNewMenu(accountId: number, restoId: number, name: string, description: string, price: number): Promise<Menu> {
        // Get restaurant
        const account = await this.accountRepo.findOne({where: {id: accountId}});
        const restaurant = await CommonMethodUtil.getRestaurantById(account, restoId);
        
        // Inject menu
        let menu = this.menuRepo.create();
        menu.name = name;
        menu.description = description;
        menu.price = price;
        menu.currency = EnumISOCurrency.IDR;
        menu.restaurant = restaurant;
        menu.account = account;
        menu = await menu.save();
        
        return menu;
    }

    async toggleMenu(accountId: number, menuId: number, isActive: boolean) {
        // Get menu
        const account = await this.accountRepo.findOne({where: {id: accountId}})
        const query = await this.menuRepo.find({where: {account, id: menuId}});
        if (query.length === 0) {
            throw ErrorMessage.NO_MENU_FOUND;
        }
        let menu = query[0];

        // Toggle menu
        menu.isActive = isActive;
        menu = await menu.save();

        return menu;
    }

    async editMenu(menuId: number) {

    }

    async deleteMenu(accountId: number, menuId: number) {
        const account = await this.accountRepo.findOne({where: {id: accountId}})
        
        // Get menu
        const query = await this.menuRepo.find({where: {account, id: menuId}});
        if (query.length === 0) {
            throw ErrorMessage.NO_MENU_FOUND;
        }
        let menu = query[0];

        // menu.deletedAt = new Date();
        await menu.softRemove();
    }
}
