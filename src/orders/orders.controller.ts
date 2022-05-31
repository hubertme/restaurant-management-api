import { Controller, Delete, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import EnumOrderChannel from 'consts/orders_enum/enum_order_channel';
import { Request, Response } from 'express';
import ServerResponse from 'responses/server_response';
import Order from './entities/order.entity';
import { CreateOrderRequest } from './orders.models';
import { OrdersService } from './orders.service';

@Controller('/orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
    ) {}

    @Get()
    async getAllOrders(@Req() req: Request, @Res() res: Response) {
        try {
            const accountId = parseInt(req.headers['x-account-id'] as string);
            const restoId = parseInt(req.query['resto_id'] as string);

            let result: Order[];
            if (isNaN(restoId)) {
                result = await this.ordersService.getAllOrders(accountId);
            } else {
                result = await this.ordersService.getAllOrdersByRestaurant(accountId, restoId);
            }

            res.status(HttpStatus.OK).json(
                ServerResponse.Success(result),
            );
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ServerResponse.GeneralError(e),
            );
        }
    }

    @Post()
    async createNewOrder(@Req() req: Request, @Res() res: Response) {
        try {
            const accountId = parseInt(req.headers['x-account-id'] as string);
            const request = CreateOrderRequest.fromJson(req.body);
            const {channel} = req.body;
            if (EnumOrderChannel.ACCEPTED_VALUES.indexOf(channel) === -1) {
                res.status(HttpStatus.BAD_REQUEST).json(
                    ServerResponse.GeneralError(EnumOrderChannel.ACCEPTED_VALUES, 'Channel can only be one of the following'),
                );
                return;
            }

            const result = await this.ordersService.createNewOrder(accountId, request);
            res.status(HttpStatus.OK).json(
                ServerResponse.Success(result),
            );
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ServerResponse.GeneralError(e),
            );
        }
    }

    @Delete('/:id')
    async cancelOrder(@Req() req: Request, @Res() res: Response) {
        try {
            const accountId = parseInt(req.headers['x-account-id'] as string);
            const menuId = parseInt(req.params['id'] as string);

            await this.ordersService.cancelOrder(accountId, menuId);
            res.status(HttpStatus.OK).json(
                ServerResponse.Success(null),
            );
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ServerResponse.GeneralError(e),
            );
        }
    }
}
