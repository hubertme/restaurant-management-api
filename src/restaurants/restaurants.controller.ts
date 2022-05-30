import { Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import ServerResponse from 'responses/server_response';
import { CreateRestaurantRequest } from './restaurants.models';
import { RestaurantsService } from './restaurants.service';

@Controller('/restaurants')
export class RestaurantsController {
    constructor(
        private readonly restaurantsService: RestaurantsService,
    ){}

    @Get()
    async getAllRestaurants(@Req() req: Request, @Res() res: Response) {
        try {
            const result = await this.restaurantsService.getAllRestaurants();
            res.status(HttpStatus.OK).json(
                ServerResponse.Success(result),
            );
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ServerResponse.GeneralError(e),
            );
        }
    }

    @Get('/:id')
    async getRestaurantById(@Req() req: Request, @Res() res: Response) {
        try {
            const restoId = parseInt(req.params['id'] as string);
            const result = await this.restaurantsService.getSingleRestaurantById(restoId);
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
    async createNewRestaurant(@Req() req: Request, @Res() res: Response) {
        try {
            const request = CreateRestaurantRequest.fromJson(req.body);
            const result = await this.restaurantsService.createNewRestaurant(request);
            res.status(HttpStatus.CREATED).json(
                ServerResponse.Success(result),
            );
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                ServerResponse.GeneralError(e),
            );
        }
    }
}
