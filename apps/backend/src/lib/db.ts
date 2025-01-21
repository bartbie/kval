import { err, ok, type Result } from '@libs/shared';
import mongoose from 'mongoose';
import type { Model, UpdateQuery } from 'mongoose';

export type ValidationResult<T> = Result<T, mongoose.Error.ValidationError>;

/**
 * Runs validated DB operations with try/catch and returns it as Result
 * @param f function to run
 * @returns Result with return value of the function or mongoose ValidationError
 */
export const runSafe = async <Ok>(
  f: () => Promise<Ok>,
): Promise<ValidationResult<Ok>> => {
  try {
    return ok(await f());
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) return err(e);
    throw e;
  }
};

export async function create<T>(model: Model<T>, data: unknown) {
  return await runSafe(async () => {
    const newEntry = new model(data);
    await newEntry.save();
    return newEntry;
  });
}

export async function update<T>(
  model: Model<T>,
  id: any,
  data: UpdateQuery<T>,
) {
  return await runSafe(async () => {
    await model
      .aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $set: data },
        {
          $merge: {
            into: model.collection.name,
            whenMatched: 'replace',
          },
        },
      ])
      .exec();

    return await model
      .aggregate([{ $match: { _id: new mongoose.Types.ObjectId(id) } }])
      .exec()
      .then((x: T[]) => x.at(0) ?? null);
  });
}

// Named it del because delete is a reserved word
export async function del<T>(model: Model<T>, id: unknown) {
  return await model.findByIdAndDelete(id);
}
