import { Controller, Get, Post, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getHello(): {name: string} {
    return {name: 'max'};
  }

  @Post()
  postHello(): string {
    return 'this method posts';
  }
}
