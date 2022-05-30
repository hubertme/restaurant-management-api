import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import JWTUtil from 'utils/jwt_util';
import PasswordUtil from 'utils/password_util';
import AccessToken from './entities/access_token.entity';
import Account from './entities/account.entity';

class ErrorMessage {
    static readonly NO_ACCOUNT = 'err/accounts/no-account';
    static readonly WRONG_PASSWORD = 'err/accounts/wrong-password';
    static readonly ALREADY_REGISTERED = 'err/accounts/already-registered'
}

class AuthInfo {
    // account: Account;
    token: string;
    expiredAtStr: string;

    constructor(token: string, expiredAtStr: string) {
        // this.account = account;
        this.token = token;
        this.expiredAtStr = expiredAtStr;
    }
}

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountRepo: Repository<Account>,

        @InjectRepository(AccessToken)
        private tokenRepo: Repository<AccessToken>,
    ) {}

    async loginAccount(email: string, password: string): Promise<AuthInfo> {
        const query = await this.accountRepo.find({where: {email}})
        if (query.length === 0) {
            throw ErrorMessage.NO_ACCOUNT;
        }

        const account = query[0];
        const isCorrect = await PasswordUtil.verify(password, account.password);
        if (!isCorrect) {
            throw ErrorMessage.WRONG_PASSWORD;
        }

        // Update last login
        account.lastLoginAt = new Date();
        account.save();

        // Fetch token
        const accessToken = await this.getAccessToken(account);
        return new AuthInfo(accessToken.token, accessToken.expiredAt.toISOString());
    }

    async registerAccount(email: string, password: string): Promise<AuthInfo> {
        const query = await this.accountRepo.find({where: {email}})
        if (query.length > 0) {
            throw ErrorMessage.ALREADY_REGISTERED;
        }

        let account = this.accountRepo.create();
        account.email = email;
        account.password = await PasswordUtil.hash(password);
        account = await account.save();

        // Obtain token
        const accessToken = await this.getAccessToken(account);
        return new AuthInfo(accessToken.token, accessToken.expiredAt.toISOString());
    }

    private async getAccessToken(account: Account): Promise<AccessToken> {
        const query = await this.tokenRepo.find({where: {account}, order: {expiredAt: "DESC"}})
        if (query.length > 0) {
            const accessToken = query[0];
            if (accessToken.isValid && accessToken.expiredAt > new Date()) {
                return accessToken;
            } else {
                return this.createNewToken(account);
            }
        } else {
            return this.createNewToken(account);
        }
    }

    private async createNewToken(account: Account): Promise<AccessToken> {
        const payload = {
            'account_id': account.id,
            'type': 'user'
        }
        const jwt = await JWTUtil.generateToken(payload);
        
        const accessToken = this.tokenRepo.create();
        accessToken.token = jwt.token;
        accessToken.expiredAt = jwt.expiredAt;
        accessToken.account = account;
        accessToken.save();

        return accessToken;
    }
}
