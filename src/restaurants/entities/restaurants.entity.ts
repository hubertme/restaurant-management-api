import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import RestaurantAddress from "./restaurant_address.entity";

@Entity()
export default class Restaurant extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'business_name'})
    businessName: string;

    @Column({name: 'legal_name'})
    legalName: string;

    @OneToOne(type => RestaurantAddress, (address) => address.restaurant)
    address: RestaurantAddress;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}