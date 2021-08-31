import { model, Schema } from 'mongoose';
import { IUSer } from './User.model';

export interface IPost {
   content?: string;
   image: string;
   likes: number[];
   id: string;
   postedBy: IUSer;
}

export const PostSchema = new Schema(
   {
      content: String,
      image: String,
      postedBy: {
         type: Schema.Types.ObjectId,
         ref: 'users'
      },
      likes: {
         type: [String],
         default: []
      }
   },
   { timestamps: true, _id: true }
);

export const PostModel = model<IPost>('posts', PostSchema);
