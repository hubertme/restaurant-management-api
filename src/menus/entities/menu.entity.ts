import Account from "src/accounts/entities/account.entity";
import Restaurant from "src/restaurants/entities/restaurants.entity";
import { BaseEntity, Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity({name: 'restaurant_menus'})
export default class Menu extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({type: 'float4'})
    price: number;

    @Column()
    currency: string;

    @Column({name: 'is_active', default: false})
    isActive: boolean;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;

    @ManyToOne(() => Restaurant, restaurant => restaurant.menus, {nullable: false})
    @JoinColumn()
    restaurant: Restaurant;

    @ManyToOne(() => Account, account => account.menus, {nullable: false})
    @JoinColumn()
    account: Account;
}