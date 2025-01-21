import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Ensemble, User } from '../../schemas';
import { UserView } from '@libs/api';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private users: Model<User>,
    // @InjectModel(Ensemble.name) private ensembles: Model<Ensemble>,
  ) {}
  async getAllUserViews(): Promise<UserView[]> {
    return await this.users
      .aggregate([
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
            email: 0,
            password: 0,
          },
        },
      ])
      .exec();
  }
  async getUserView(id: string): Promise<UserView | null> {
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
              email: 0,
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
}
