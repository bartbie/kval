import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'bson';
import { HydratedDocument } from 'mongoose';

const strArrayOpts = { type: [String], default: Array };

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

  @Prop()
  createdBy: string;

  @Prop(strArrayOpts)
  members: string[];

  @Prop(strArrayOpts)
  genres: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

export const EnsembleSchema = SchemaFactory.createForClass(Ensemble);
export type EnsembleDocument = HydratedDocument<Ensemble>;
