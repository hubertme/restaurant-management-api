import { Controller, Get } from '@nestjs/common';
import ServerResponse from 'responses/server_response';
import { AppService } from './app.service';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test')
  getHelloResponse(): ServerResponse {
    const result = this.appService.getHello();
    return ServerResponse.Success(result);
  }
}
