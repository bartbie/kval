import { err, ok, type Result } from '@libs/shared';
import mongoose from 'mongoose';
import type { Model as Schema, UpdateQuery } from 'mongoose';

export type ValidationResult<T> = Result<T, mongoose.Error.ValidationError>;

/**
 * Runs validated DB operations with try/catch and returns it as Result
 * @param f function to run
 * @returns Result with return value of the function or mongoose ValidationError
 */
const runSafe = async <Ok>(
  f: () => Promise<Ok>,
): Promise<ValidationResult<Ok>> => {
  try {
    return ok(await f());
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) return err(e);
    throw e;
  }
};

export async function create<T>(model: Schema<T>, data: unknown) {
  return await runSafe(async () => {
    const newEntry = new model(data);
    await newEntry.save();
    return newEntry;
  });
}

export async function update<T>(
  model: Schema<T>,
  id: unknown,
  data: UpdateQuery<T>,
) {
  return await runSafe(async () => {
    return await model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  });
}

// Named it del because delete is a reserved word
export async function del<T>(model: Schema<T>, id: unknown) {
  return await model.findByIdAndDelete(id);
}
