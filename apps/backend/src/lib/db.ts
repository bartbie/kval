import { err, ok, type Result } from '@libs/shared';
import mongoose from 'mongoose';
import type { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Id } from 'src/schemas';

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
  id: Id,
  data: UpdateQuery<T>,
  filter?:
    | { [P in keyof T]?: string | number | boolean | object }
    | string
    | string[],
) {
  return await runSafe(async () => {
    const ex = model.findByIdAndUpdate(id, data, { new: true });
    if (filter != undefined) return await ex.select(filter as any);
    return await ex.exec();
  });
  // return await runSafe(async () => {
  //   const match = { $match: { _id: id } };
  //   await model
  //     .aggregate([
  //       match,
  //       { $set: data },
  //       {
  //         $merge: {
  //           into: model.collection.name,
  //           whenMatched: 'replace',
  //         },
  //       },
  //     ])
  //     .exec();
  //
  //   return await model
  //     .aggregate(filter != undefined ? [match, { $project: filter }] : [match])
  //     .exec()
  //     .then((x: T[]) => x.at(0) ?? null);
  // });
}

// Named it del because delete is a reserved word
export async function del<T>(model: Model<T>, id: Id) {
  return await model.findByIdAndDelete(id);
}
