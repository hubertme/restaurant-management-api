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

    @OneToOne(() => RestaurantAddress, address => address.restaurant, {eager: true, onDelete: 'CASCADE'})
    @JoinColumn()
    address: RestaurantAddress;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;
}