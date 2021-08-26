import { model, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

interface IPost {
   content?: string;
   image: string;
   likes: number[];
   id: string;
   userID: string;
}

export const PostSchema = new Schema(
   {
      content: String,
      image: String,
      userID: String,
      id: {
         type: String,
         default: nanoid
      },
      likes: {
         type: [String],
         default: []
      }
   },
   { timestamps: true }
);

export const PostModel = model<IPost>('posts', PostSchema);
