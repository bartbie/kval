import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get('/healthcheck')
  healthcheck(): string {
    return 'Server is running';
  }

  @Get('/healthcheck/protected')
  @UseGuards(AuthGuard)
  protected_healthcheck(): string {
    return 'Server is running';
  }
}
