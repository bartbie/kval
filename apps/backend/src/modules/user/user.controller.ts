import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { err, ok } from '@libs/shared';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUserViews() {
    return ok(await this.userService.getAllUserViews());
  }

  @Get(':id')
  @UsePipes(new ZodValidationPipe(z.string()))
  async getUserView(@Param('id') id: string) {
    const res = await this.userService.getUserView(id);
    return res != null ? ok(res) : err('No such id');
  }
}
