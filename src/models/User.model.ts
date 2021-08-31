import { model, Schema } from 'mongoose';
import { PostSchema } from '$models/Post.model';
import { nanoid } from 'nanoid';

export interface IUSer {
   _id: string;
   posts?: [];
   username: string;
   password: string;
}

export const UserSchema = new Schema(
   {
      username: String,
      password: String
   },
   {
      timestamps: true
   }
);

export const UsersModel = model<IUSer>('users', UserSchema);
