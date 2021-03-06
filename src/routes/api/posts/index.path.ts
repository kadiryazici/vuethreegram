import { IPost, PostModel } from '$models/Post.model';

import { Handler } from 'express';
import { csrfGuard } from '@/middlewares/csrf';
import { defineRoute } from '$utils/api';

export const setRoute = defineRoute(async (app, path) => {
   app.get(path, csrfGuard, Get());
});

function Get(): Handler {
   return async (req, res) => {
      const posts = await PostModel.find()
         .select('-__v')
         .populate('postedBy' as keyof IPost, '-password -__v -posts')
         .sort({ createdAt: '-1' })
         .exec();
      res.send(posts);
   };
}
