import { Module } from '@nestjs/common';
import { EnsembleController } from './ensemble.controller';
import { EnsembleService } from './ensemble.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ensemble, EnsembleSchema } from 'src/schemas';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ensemble.name, schema: EnsembleSchema },
    ]),
    AuthModule,
  ],
  controllers: [EnsembleController],
  providers: [EnsembleService],
})
export class EnsembleModule {}
