import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import ServerResponse from 'responses/server_response';
import { AccountsService } from './accounts.service';

@Controller('/accounts')
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
    ) {}

    @Post('/login')
    async loginAccount(@Req() req: Request, @Res() res: Response) {
        try {
            const {email, password} = req.body;
            const result = await this.accountsService.loginAccount(email, password);
            res.status(HttpStatus.OK).json(result);
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ServerResponse.GeneralError(e),
            );
        }
    }

    @Post('/register')
    async registerAccount(@Req() req: Request, @Res() res: Response) {
        try {
            const {email, password} = req.body;
            const result = await this.accountsService.registerAccount(email, password);
            res.status(HttpStatus.CREATED).json(result);
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ServerResponse.GeneralError(e),
            );
        }
    }
}
