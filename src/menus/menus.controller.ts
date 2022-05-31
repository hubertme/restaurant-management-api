import { Controller, Delete, Get, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import ServerResponse from 'responses/server_response';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
    constructor(
        private readonly menusService: MenusService,
    ){}

    @Get()
    async getAllMenus(@Req() req: Request, @Res() res: Response) {
        try {
            const accountId = parseInt(req.headers['x-account-id'] as string);
            const restoId = parseInt(req.query['resto_id'] as string);
            const result = await this.menusService.getAllMenus(accountId, restoId);
            res.status(HttpStatus.OK).json(
                ServerResponse.Success(result),
            );
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                ServerResponse.GeneralError(e),
            );
        }
    }

    @Post()
    async createNewMenu(@Req() req: Request, @Res() res: Response) {
        try {
            const accountId = parseInt(req.headers['x-account-id'] as string);
            const {restaurant_id: restoId, name, description, price} = req.body;
            const result = await this.menusService.addNewMenu(accountId, restoId, name, description, price);
            res.status(HttpStatus.CREATED).json(
                ServerResponse.Success(result),
            );
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                ServerResponse.GeneralError(e),
            );
        }
    }

    @Patch()
    async toggleMenu(@Req() req: Request, @Res() res: Response) {
        try {
            const accountId = parseInt(req.headers['x-account-id'] as string);
            const {menu_id: menuId, active} = req.body;
            const result = await this.menusService.toggleMenu(accountId, menuId, active);
            res.status(HttpStatus.OK).json(
                ServerResponse.Success(result),
            );
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                ServerResponse.GeneralError(e),
            );
        }
    }

    @Delete('/:id')
    async deleteMenu(@Req() req: Request, @Res() res: Response) {
        try {
            const accountId = parseInt(req.headers['x-account-id'] as string);
            const menuId = parseInt(req.params['id'] as string);
            await this.menusService.deleteMenu(accountId, menuId);
            res.status(HttpStatus.OK).json(
                ServerResponse.Success(null),
            );
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
                ServerResponse.GeneralError(e),
            );
        }
    }
}
