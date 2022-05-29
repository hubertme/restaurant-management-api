import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Restaurant from "./restaurants.entity";

@Entity()
export default class RestaurantAddress extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({name: 'country_iso'})
    countryISO: string;

    @Column({type: 'float4'})
    latitude: number;

    @Column({type: 'float4'})
    longitude: number;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;

    @OneToOne(() => Restaurant, restaurant => restaurant.address)
    restaurant: Restaurant;
}