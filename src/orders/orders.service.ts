import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ConstCalculationRates from 'consts/orders_enum/calculation_rates';
import Menu from 'src/menus/entities/menu.entity';
import Restaurant from 'src/restaurants/entities/restaurants.entity';
import { getConnection, Repository } from 'typeorm';
import CommonMethodUtil from 'utils/common_util';
import Order from './entities/order.entity';
import OrderItem from './entities/order_item.entity';
import { CreateOrderRequest } from './orders.models';

class ErrorMessage {
    static readonly CANCELLED_ORDER = 'err/orders/cancelled-order';
    static readonly ORDER_EXIST = 'err/orders/order-exist';
    static readonly INVALID_MENU = 'err/orders/invalid-menu';
    static readonly INACTIVE_MENU = 'err/orders/inactive-menu';
}

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Restaurant)
        private restoRepo: Repository<Restaurant>,

        @InjectRepository(Menu)
        private menuRepo: Repository<Menu>,

        @InjectRepository(Order)
        private orderRepo: Repository<Order>,

        @InjectRepository(OrderItem)
        private orderItemRepo: Repository<OrderItem>,
    ) {}

    async getAllOrders(accountId: number): Promise<Order[]> {
        const account = await CommonMethodUtil.getAccountById(accountId);
        const orders = this.orderRepo.find({where: {account}});

        return orders;
    }

    async getAllOrdersByRestaurant(accountId: number, restoId: number): Promise<Order[]> {
        const restaurant = await CommonMethodUtil.getRestaurantById(accountId, restoId);
        const orders = this.orderRepo.find({where: {restaurant}});

        return orders;
    }

    async cancelOrder(accountId: number, orderId: number) {
        const account = await CommonMethodUtil.getAccountById(accountId);
        const order = await this.orderRepo.findOne({where: {id: orderId, account}});

        if (order == null) {
            throw ErrorMessage.CANCELLED_ORDER;
        }

        await order.softRemove();
    }

    async createNewOrder(accountId: number, request: CreateOrderRequest): Promise<Order> {
        const account = await CommonMethodUtil.getAccountById(accountId);
        const restaurant = await CommonMethodUtil.getRestaurantById(account, request.restoId);

        if (request.refId != null) {
            const refOrders = await this.orderRepo.find({where: {refId: request.refId, account}});
            if (refOrders.length > 0) {
                throw ErrorMessage.ORDER_EXIST;
            }
        }

        const conn = getConnection();
        const queryRunner = conn.createQueryRunner();
        await queryRunner.startTransaction();

        let newOrder = this.orderRepo.create();
        try {
            // Save the order
            newOrder.restaurant = restaurant;
            newOrder.account = account;
            newOrder.channel = request.channel;
            newOrder.customerName = request.customerName;
            newOrder.refId = request.refId;
            newOrder = await queryRunner.manager.save(newOrder);

            // Save the order items
            for (const item of request.items) {
                const menu = await this.menuRepo.findOne({where: {id: item.menuId, restaurant}});
                if (menu == null) {
                    throw ErrorMessage.INVALID_MENU;
                } else if (!menu.isActive) {
                    throw ErrorMessage.INACTIVE_MENU;
                }
                
                let orderItem = this.orderItemRepo.create();
                orderItem.order = newOrder;
                orderItem.menu = menu;
                orderItem.quantity = item.quantity;
                orderItem.subtotal = menu.price * item.quantity;
                orderItem = await queryRunner.manager.save(orderItem);

                newOrder.subtotal += orderItem.subtotal;
            }

            // Calculate price
            let walkingPricePoint = newOrder.subtotal;
            newOrder.serviceCharge = Math.floor(restaurant.serviceChargeRate/100 * walkingPricePoint);
            walkingPricePoint += newOrder.serviceCharge;
            newOrder.tax = Math.floor(ConstCalculationRates.TAX_RATE * walkingPricePoint);
            walkingPricePoint += newOrder.tax;
            newOrder.total = Math.ceil(walkingPricePoint/100)*100;
            newOrder.rounding = Math.ceil(newOrder.total - walkingPricePoint);
            newOrder = await queryRunner.manager.save(newOrder);

            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }

        return newOrder;
    }
}
