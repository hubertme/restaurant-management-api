import Account from "src/accounts/entities/account.entity";
import Restaurant from "src/restaurants/entities/restaurants.entity";
import { getRepository } from "typeorm";

class ErrorMessage {
    static readonly NO_RESTAURANT_FOUND = 'err/common/no-restaurant-found';
    static readonly NO_ACCOUNT_FOUND = 'err/common/no-account-found';
}

export default class CommonMethodUtil {
    static async getRestaurantById(accountId: number, restoId: number): Promise<Restaurant>;
    static async getRestaurantById(account: Account, restoId: number): Promise<Restaurant>;

    /**
     * Get restaurant by providing account/account_id and restaurant_id
     * @param accountOrId 
     * @param restoId 
     * @returns The restaurant object
     */
    static async getRestaurantById(accountOrId: Account | number, restoId: number): Promise<Restaurant> {
        let account: Account;
        if (typeof accountOrId == "number") {
            account = await this.getAccountById(accountOrId);
        } else {
            account = accountOrId;
        }

        const restoRepo = getRepository(Restaurant);
        const restaurant = await restoRepo.findOne({where: {account, id: restoId}});
        if (restaurant == null) {
            throw ErrorMessage.NO_RESTAURANT_FOUND;
        }

        return restaurant;
    }

    static async getAccountById(accountId: number): Promise<Account> {
        const accountRepo = getRepository(Account);
        const account = await accountRepo.findOne({where: {id: accountId}});
        
        if (account == null) {
            throw ErrorMessage.NO_ACCOUNT_FOUND;
        }

        return account;
    }
}