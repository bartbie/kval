import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { User } from '../../schemas';
import { MeWithEnsembles, UpdateMe } from '@libs/api';
import { update } from 'src/lib/db';

type Id = string | mongoose.Types.ObjectId;

@Injectable()
export class MeService {
  constructor(@InjectModel(User.name) private users: Model<User>) {}
  async getUserView(id: Id): Promise<MeWithEnsembles | null> {
    try {
      return await this.users
        .aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(id) },
          },
          {
            $lookup: {
              from: 'ensembles',
              localField: '_id',
              foreignField: 'members',
              as: 'ensembles',
            },
          },
          {
            $project: {
              password: 0,
            },
          },
        ])
        .exec()
        .then((x) => x.at(0) ?? null);
    } catch {
      return null;
    }
  }

  async updateMe(id: Id, patch: UpdateMe) {
    console.log(patch);
    return await update(this.users, id, patch);
  }
}
