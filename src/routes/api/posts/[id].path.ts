import { IPost, PostModel } from '$models/Post.model';
import { ThrowRequest, defineRoute } from '$utils/api';

import { ErrorType } from '$const/errorTypes';
import { Handler } from 'express';
import { Msg } from '$const/msg';
import { csrfGuard } from '@/middlewares/csrf';
import { usePromise } from 'vierone';

export const setRoute = defineRoute(async (app, path) => {
   app.get(path, csrfGuard, Post());
});

function Post(): Handler {
   return async (req, res) => {
      const id = req.params.id;
      const [postData, postError] = await usePromise(
         PostModel.findOne({ _id: id })
            .select('-__v')
            .populate('postedBy' as keyof IPost, '-password -__v -posts')
            .sort({ createdAt: '-1' })
            .exec()
      );
      if (!postData || postError) {
         return ThrowRequest(res, {
            message: Msg.NotFound,
            status: 'NotFound',
            type: ErrorType.NotFound
         });
      }
   };
}
