import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Ensemble, EnsembleDocument, Id } from 'src/schemas';
import * as api from '@libs/api';
import { err, ok } from '@libs/shared';
import { create, del, runSafe, update } from 'src/lib/db';

const CheckStatus = {
  NoSuchEnsemble: "Ensemble doesn't exist",
  // NoSuchUser: "User doesn't exist",
  UserInMembers: 'User already in members',
  UserNotInMembers: 'User is not a member',
  UserOwner: 'User created this ensemble',
} as const;

type CheckStatus = typeof CheckStatus;

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

  async getFull(
    id: Id,
  ): Promise<
    (Omit<api.EnsembleFull, 'id'> & Omit<EnsembleDocument, 'members'>) | null
  > {
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
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async get(id: Id): Promise<EnsembleDocument | null> {
    try {
      return await this.ensembles.findById(id);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async _check(ensId: Id, userId: Id) {
    const ens = await this.get(ensId);
    if (ens == null) {
      return {
        stat: CheckStatus.NoSuchEnsemble,
        // data: err(CheckStatus.UserNotInMembers),
      } as const;
    }
    // if (user == null) {
    //   return {
    //     stat: CheckStatus.NoSuchUser,
    //     // data: err(CheckStatus.UserNotInMembers),
    //   } as const;
    // }
    if (ens.createdBy.equals(userId)) {
      return {
        stat: CheckStatus.UserOwner,
        data: [ens],
      } as const;
    }
    if (ens.members.some((id) => id.equals(userId))) {
      return {
        stat: CheckStatus.UserInMembers,
        data: [ens],
      } as const;
    }
    return {
      stat: CheckStatus.UserNotInMembers,
      data: [ens],
    } as const;
  }

  async join(ensId: Id, userId: Id) {
    const { data, stat } = await this._check(ensId, userId);
    if (stat != CheckStatus.UserNotInMembers) {
      return err(stat);
    }
    const [ens] = data;
    return update(
      this.ensembles,
      ensId,
      { members: [...ens.members, userId] },
      { members: { email: 0, password: 0 } },
    );
  }

  async leave(ensId: Id, userId: Id) {
    const { data, stat } = await this._check(ensId, userId);
    if (stat == CheckStatus.NoSuchEnsemble) {
      return err(stat);
    }
    if (stat == CheckStatus.UserOwner) {
      return err(
        "You can't leave your own ensemble, you have to disband it instead!",
      );
    }
    const [ens] = data;
    const members = ens.members.filter((id) => !id.equals(userId));
    return update(
      this.ensembles,
      ensId,
      { members },
      { members: { email: 0, password: 0 } },
    );
  }

  async disband(ensId: Id, userId: Id) {
    const { data, stat } = await this._check(ensId, userId);
    if (stat == CheckStatus.NoSuchEnsemble) {
      return err(stat);
    }
    if (stat != CheckStatus.UserOwner)
      return err('Only owners can disband ensembles!');
    const [ens] = data;
    await del(this.ensembles, ens._id);
    return ok();
  }

  async create(userId: Id, body: api.NewEnsemble) {
    const id = userId;
    const x = await create(this.ensembles, {
      ...body,
      createdBy: id,
      members: [id],
    });
    return x;
  }

  async edit(ensId: Id, userId: Id, body: api.UpdateEnsemble) {
    const { data, stat } = await this._check(ensId, userId);
    if (stat == CheckStatus.NoSuchEnsemble) {
      return err(stat);
    }
    if (stat != CheckStatus.UserOwner)
      return err('Only owners can edit ensembles!');
    const [ens] = data;
    return await update(this.ensembles, ens._id, body, {
      members: { email: 0, password: 0 },
    });
  }
}
