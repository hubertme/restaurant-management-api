import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import AccessToken from './entities/access_token.entity';
import Account from './entities/account.entity';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [
    TypeOrmModule.forFeature([
      AccessToken,
      Account
    ]),
  ],
  exports: [TypeOrmModule],
})
export class AccountsModule {}
