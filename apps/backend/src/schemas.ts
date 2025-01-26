import { ArgumentMetadata, Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { createZodValidationPipe, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
const { ObjectId } = mongoose.Types;

export type Id = mongoose.Types.ObjectId;

export const IdSchema = z.string().transform((val, ctx) => {
  try {
    if (!ObjectId.isValid(val)) {
      throw null;
    }
    return new ObjectId(val);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid id',
    });
    return z.NEVER;
  }
});
// .length(24)
// .regex(/^[0-9A-Fa-f]+$/, 'Invalid id')

@Injectable()
export class IdValidationPipeClass extends ZodValidationPipe {
  transform(value: unknown, metadata: ArgumentMetadata) {
    // Only validate if it's an 'id' parameter
    if (metadata.type === 'param' && metadata.data === 'id') {
      return super.transform(value, metadata);
    }
    return value;
  }
}

export const IdValidationPipe = new IdValidationPipeClass(IdSchema);

const strArrayOpts = { type: [String], default: [] };

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  age: number;

  @Prop()
  bio: string;

  @Prop(strArrayOpts)
  instruments: string[];

  @Prop(strArrayOpts)
  genres: string[];
}

@Schema()
export class Ensemble {
  @Prop()
  name: string;

  @Prop({ type: ObjectId, ref: 'User' })
  createdBy: Id;

  @Prop({ type: [{ type: ObjectId, ref: 'User' }], default: [] })
  members: Id[];

  @Prop(strArrayOpts)
  genres: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

export const EnsembleSchema = SchemaFactory.createForClass(Ensemble);
export type EnsembleDocument = HydratedDocument<Ensemble>;
