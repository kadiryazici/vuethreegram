import { model, Schema } from 'mongoose';

export const PostSchema = new Schema(
   {
      name: String,
      image: String
   },
   { timestamps: true }
);

export const PostModel = model('posts', PostSchema);
