// user.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: "buyyers" })
export class User {
  @Prop({ require: true, unique: true })
  googleId: string;

  @Prop({ required: true,  index:true, unique: true, type: String })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
