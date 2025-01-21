import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EnsembleService } from './ensemble.service';
import { AuthGuard, UserCtx } from '../auth/auth.guard';
import { err, ok } from '@libs/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { UserWithId } from 'src/lib/auth';
import {
  NewEnsemble,
  newEnsembleSchema,
  UpdateEnsemble,
  updateEnsembleSchema,
} from '@libs/api';
import { IdValidationPipe, Id } from 'src/schemas';

@Controller('ensembles')
export class EnsembleController {
  constructor(private readonly ensembleService: EnsembleService) {}

  @Get()
  async getAll() {
    return ok(await this.ensembleService.getAllFull());
  }

  @Get(':id')
  @UsePipes(IdValidationPipe)
  async getUserView(@Param('id') id: Id) {
    const res = await this.ensembleService.getFull(id);
    return res != null ? ok(res) : err('No such id');
  }

  @Post(':id/join')
  @UseGuards(AuthGuard)
  @UsePipes(IdValidationPipe)
  async join(@UserCtx() user: UserWithId, @Param('id') id: Id) {
    return await this.ensembleService.join(id, user._id);
  }

  @Post(':id/leave')
  @UseGuards(AuthGuard)
  @UsePipes(IdValidationPipe)
  async leave(@UserCtx() user: UserWithId, @Param('id') id: Id) {
    return await this.ensembleService.leave(id, user._id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UsePipes(IdValidationPipe)
  async disband(@UserCtx() user: UserWithId, @Param('id') id: Id) {
    return await this.ensembleService.disband(id, user._id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @UserCtx() user: UserWithId,
    @Body(new ZodValidationPipe(newEnsembleSchema)) body: NewEnsemble,
  ) {
    return await this.ensembleService.create(user._id, body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(IdValidationPipe)
  async edit(
    @UserCtx() user: UserWithId,
    @Param('id') id: Id,
    @Body(new ZodValidationPipe(updateEnsembleSchema)) body: UpdateEnsemble,
  ) {
    return await this.ensembleService.edit(id, user._id, body);
  }
}
