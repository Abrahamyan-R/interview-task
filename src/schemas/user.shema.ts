import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ default: uuidV4 })
  _id: string

  @Prop()
  first_name: string

  @Prop()
  last_name: string

  @Prop()
  username: string

  @Prop({ select: false })
  __v: number
}

export const UserSchema = SchemaFactory.createForClass(User);