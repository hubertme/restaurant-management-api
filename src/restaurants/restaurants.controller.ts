import { Controller, Get } from '@nestjs/common';

@Controller('/restaurants')
export class RestaurantsController {
    @Get()
    getBasic(): string {
        return 'restaurants routes'
    }
}
