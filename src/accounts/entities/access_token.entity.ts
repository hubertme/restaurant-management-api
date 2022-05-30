import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Account from "./account.entity";

@Entity('access_tokens')
export default class AccessToken extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({name: 'expired_at'})
    expiredAt: Date;

    @Column({name: 'is_valid', default: true})
    isValid: boolean;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;

    @ManyToOne(() => Account, account => account.tokens, {eager: true, nullable: false})
    @JoinColumn()
    account: Account;
}