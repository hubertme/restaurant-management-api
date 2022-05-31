import Menu from "src/menus/entities/menu.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Order from "./order.entity";

@Entity('order_items')
export default class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.items, {nullable: false})
    @JoinColumn()
    order: Order;

    @ManyToOne(() => Menu, {nullable: false})
    @JoinColumn()
    menu: Menu;

    @Column()
    quantity: number;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;

    @Column({type: 'float4', nullable: false})
    subtotal: number;
}