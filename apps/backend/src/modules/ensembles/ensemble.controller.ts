import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnsembleService } from './ensemble.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ensembles')
export class EnsembleController {
  constructor(private readonly ensembleService: EnsembleService) {}

  @Get()
  async get() {
    return await this.ensembleService.findAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  async get_tes() {
    return await this.ensembleService.findAll();
  }
}
