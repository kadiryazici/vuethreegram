import { model, Schema } from 'mongoose';
import { PostSchema } from '$models/Post.model';
import { nanoid } from 'nanoid';

interface IUSer {
   id?: string;
   posts?: [];
   username: string;
   password: string;
}

export const UserSchema = new Schema(
   {
      id: {
         type: String,
         default: nanoid
      },
      username: String,
      password: String,
      posts: {
         type: [PostSchema],
         default: []
      }
   },
   {
      timestamps: true
   }
);

export const UsersModel = model<IUSer>('Users', UserSchema);
