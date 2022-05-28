import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Restaurant from "./restaurants.entity";

@Entity()
export default class RestaurantAddress extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => Restaurant, restaurant => restaurant.address)
    @JoinColumn()
    restaurant: Restaurant;

    @Column({name: 'add_line_1'})
    addLine1: string;

    @Column({name: 'add_line_2'})
    addLine2: string;

    @Column()
    subdistrict: string;

    @Column()
    district: string;

    @Column()
    city: string;

    @Column()
    province: string;

    @Column({name: 'country'})
    countryISO: string;

    @Column({type: 'float4'})
    latitude: number;

    @Column({type: 'float4'})
    longitude: number;

    @Column({default: false})
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}