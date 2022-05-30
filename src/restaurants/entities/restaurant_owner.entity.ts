import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Restaurant from "./restaurants.entity";

@Entity({name: 'restaurant_owners'})
export default class RestaurantOwner extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Restaurant, restaurant => restaurant.owner)
    restaurant: Restaurant;

    @Column({name: 'first_name'})
    firstName: string;

    @Column({name: 'last_name'})
    lastName: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;
}
