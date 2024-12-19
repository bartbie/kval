import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Ensemble } from 'src/schemas';
import * as api from '@libs/api';

@Injectable()
export class EnsembleService {
  constructor(@InjectModel(Ensemble.name) private model: Model<Ensemble>) {}

  async create(newe: api.NewEnsemble): Promise<Ensemble> {
    return new this.model({ ...newe }).save();
  }

  async findAll(): Promise<Ensemble[]> {
    return this.model.find().exec();
  }
}
