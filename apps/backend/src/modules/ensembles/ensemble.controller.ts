import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EnsembleService } from './ensemble.service';
import { AuthGuard } from '../auth/auth.guard';
import { err, ok } from '@libs/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { Id, IdValidationPipe } from 'src/schemas';

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
}
