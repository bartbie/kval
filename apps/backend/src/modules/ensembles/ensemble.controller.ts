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

@Controller('ensembles')
export class EnsembleController {
  constructor(private readonly ensembleService: EnsembleService) {}

  @Get()
  async getAll() {
    return ok(await this.ensembleService.getAllFull());
  }

  @Get(':id')
  @UsePipes(new ZodValidationPipe(z.string()))
  async getUserView(@Param('id') id: string) {
    const res = await this.ensembleService.getFull(id);
    return res != null ? ok(res) : err('No such id');
  }
}
