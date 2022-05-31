import Account from "src/accounts/entities/account.entity";
import Menu from "src/menus/entities/menu.entity";
import Order from "src/orders/entities/order.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import RestaurantAddress from "./restaurant_address.entity";
import RestaurantOwner from "./restaurant_owner.entity";

@Entity({name: 'restaurants'})
export default class Restaurant extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'business_name'})
    businessName: string;

    @Column({name: 'legal_name'})
    legalName: string;

    @OneToOne(() => RestaurantAddress, address => address.restaurant, {eager: true, onDelete: 'CASCADE', nullable: false})
    @JoinColumn()
    address: RestaurantAddress;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;

    @OneToOne(() => RestaurantOwner, owner => owner.restaurant, {eager: true, onDelete: 'CASCADE', nullable: false})
    @JoinColumn()
    owner: RestaurantOwner;

    @OneToMany(() => Menu, menu => menu.restaurant, {eager: true, onDelete: 'CASCADE'})
    menus: Menu[]

    @ManyToOne(() => Account, acc => acc.restaurants, {nullable: false})
    @JoinColumn()
    account: Account;

    @OneToMany(() => Order, order => order.restaurant)
    orders: Order[];

    @Column({name: 'service_charge_rate', default: 0, type: 'float4'})
    serviceChargeRate: number;
}