import Menu from "src/menus/entities/menu.entity";
import Restaurant from "src/restaurants/entities/restaurants.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import AccessToken from "./access_token.entity";

@Entity('accounts')
export default class Account extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({name: 'is_active', default: true})
    isActive: boolean;

    @Column({name: 'last_login_at', nullable: true})
    lastLoginAt: Date;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;

    @OneToOne(() => Restaurant, restaurant => restaurant.account)
    restaurants: Restaurant[];

    @OneToMany(() => AccessToken, token => token.account, {onDelete: 'CASCADE'})
    tokens: AccessToken[];

    @OneToMany(() => Menu, menu => menu.account)
    menus: Menu[];
}