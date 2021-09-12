import { IPost, PostModel } from '$models/Post.model';
import { ThrowRequest, defineRoute } from '$utils/api';

import { Api } from '@/types';
import { Constant } from '$const/index';
import { ErrorType } from '$const/errorTypes';
import { Handler } from 'express';
import { Msg } from '$const/msg';
import { UsersModel } from '$models/User.model';
import { csrfGuard } from '@/middlewares/csrf';
import { usePromise } from 'vierone';

export const setRoute = defineRoute(async (app, path) => {
   app.get(path, csrfGuard, Get());
});

const { postCountPerPage } = Constant.user.profile;
const PostQuery = (userID: string, page: number) => {
   const skipValue = page * postCountPerPage - postCountPerPage;
   //@ts-ignore
   const PostCountReturner = () => PostModel.countDocuments({ postedBy: userID }).exec();
   const PostQueryReturner = () =>
      //@ts-ignore
      PostModel.find({ postedBy: userID })
         .select('-__v')
         .sort({ createdAt: '-1' })
         .skip(skipValue)
         .limit(postCountPerPage)
         .exec();
   return Promise.all([PostQueryReturner(), PostCountReturner()]);
};

function Get(): Handler {
   return async (req, res) => {
      const userName = req.params.userName;
      const queryPage = req.query.page;
      // @ts-ignore
      const parsedQueryPage = parseInt(queryPage);
      let page = 1;
      if (
         typeof queryPage === 'string' &&
         typeof parsedQueryPage === 'number' &&
         !isNaN(parsedQueryPage) &&
         parsedQueryPage > 0
      ) {
         page = parsedQueryPage;
      }

      const [userData, userError] = await usePromise(
         UsersModel.findOne({ username: userName }).select('-password -__v').exec()
      );
      if (userError || !userData) {
         return ThrowRequest(res, {
            message: Msg.NotFound,
            status: 'NotFound',
            type: ErrorType.NotFound
         });
      }

      const [postData, getPostError] = await usePromise(PostQuery(userData._id!, page));
      if (!postData || getPostError) {
         return ThrowRequest(res, {
            message: Msg.NotFound,
            status: 'NotFound',
            type: ErrorType.NotFound
         });
      }
      const [posts, postCount] = postData;

      return res.json({
         currentPage: page,
         totalCount: postCount,
         totalPage: Math.ceil(postCount / postCountPerPage),
         posts: posts as unknown as any,
         user: userData as unknown as any
      } as Api.ProfileResponse);
   };
}
