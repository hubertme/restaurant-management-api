import Account from "src/accounts/entities/account.entity";
import Restaurant from "src/restaurants/entities/restaurants.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import OrderItem from "./order_item.entity";
import OrderProgress from "./order_progress.entity";

@Entity('orders')
export default class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'ref_id', nullable: true})
    refId: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;

    @ManyToOne(() => Restaurant, e => e.orders, {nullable: false})
    @JoinColumn()
    restaurant: Restaurant;

    @OneToMany(() => OrderItem, items => items.order, {eager: true})
    items: OrderItem[];

    @ManyToOne(() => Account, e => e.orders, {nullable: false})
    @JoinColumn()
    account: Account;

    @Column({type: 'float4', default: 0})
    subtotal: number;

    @Column({type: 'float4', default: 0})
    tax: number;

    @Column({name: 'service_charge', type: 'float4', default: 0})
    serviceCharge: number;

    @Column({type: 'float4', default: 0})
    rounding: number;

    @Column({type: 'float4', default: 0})
    total: number;

    @Column({name: 'customer_name', nullable: true})
    customerName: string;

    @Column()
    channel: number;

    @Column({name: 'finished_at', nullable: true})
    finishedAt: Date;

    @OneToMany(() => OrderProgress, e => e.order, {eager: true})
    progressLog: OrderProgress[];
}