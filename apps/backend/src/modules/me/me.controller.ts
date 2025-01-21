import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { err, ok } from '@libs/shared';
import * as api from '@libs/api';
import { MeService } from './me.service';
import { AuthGuard, UserCtx } from '../auth/auth.guard';
import { UserWithId } from 'src/lib/auth';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('me')
export class MeController {
  constructor(private meService: MeService) {}

  @Get()
  @UseGuards(AuthGuard)
  async get(@UserCtx() user: UserWithId) {
    return ok(await this.meService.getUserView(user._id));
  }

  @Patch()
  @UseGuards(AuthGuard)
  async patch(
    @UserCtx() user: UserWithId,
    @Body(new ZodValidationPipe(api.updateMeSchema)) body: api.UpdateMe,
  ) {
    console.log(user);
    return await this.meService.updateMe(user._id, body);
  }
}
