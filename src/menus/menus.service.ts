import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EnumISOCurrency from 'consts/enum/iso_currencies';
import Restaurant from 'src/restaurants/entities/restaurants.entity';
import { Repository } from 'typeorm';
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
    ) {}

    async getAllMenus(): Promise<Menu[]> {
        const menus = await this.menuRepo.find();
        return menus;
    }

    async addNewMenu(restoId: number, name: string, description: string, price: number): Promise<Menu> {
        // Get restaurant
        const query = await this.restoRepo.findByIds([restoId]);
        const resto = query[0];
        
        // Inject menu
        let menu = this.menuRepo.create();
        menu.name = name;
        menu.description = description;
        menu.price = price;
        menu.currency = EnumISOCurrency.IDR;
        menu.restaurant = resto;
        menu = await menu.save();
        
        return menu;
    }

    async toggleMenu(menuId: number, isActive: boolean) {
        // Get menu
        const query = await this.menuRepo.findByIds([menuId]);
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

    async deleteMenu(menuId: number) {
        // Get menu
        const query = await this.menuRepo.findByIds([menuId]);
        if (query.length === 0) {
            throw ErrorMessage.NO_MENU_FOUND;
        }
        let menu = query[0];

        menu.deletedAt = new Date();
        await menu.save();
    }
}
