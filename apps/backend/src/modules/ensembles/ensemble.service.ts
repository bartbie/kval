import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Ensemble, Id } from 'src/schemas';
import * as api from '@libs/api';

@Injectable()
export class EnsembleService {
  constructor(@InjectModel(Ensemble.name) private ensembles: Model<Ensemble>) {}

  async getAllFull(): Promise<api.EnsembleFull[]> {
    return this.ensembles
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'members',
            foreignField: '_id',
            as: 'members',
          },
        },
        {
          $project: {
            members: {
              email: 0,
              password: 0,
            },
          },
        },
      ])
      .exec();
  }

  async getFull(id: Id): Promise<api.EnsembleFull | null> {
    try {
      return await this.ensembles
        .aggregate([
          {
            $match: { _id: id },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'members',
              foreignField: '_id',
              as: 'members',
            },
          },
          {
            $project: {
              members: {
                email: 0,
                password: 0,
              },
            },
          },
        ])
        .exec()
        .then((x) => x.at(0) ?? null);
    } catch {
      return null;
    }
  }
}
