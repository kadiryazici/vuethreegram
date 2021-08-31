import { IPost, PostModel } from '$models/Post.model';
import { defineRoute } from '$utils/api';

export const setRoute = defineRoute(async (app, path) => {
   app.get(path, async (req, res) => {
      const id = req.params.userID;

      // @ts-ignore
      const posts = await PostModel.find({ postedBy: id })
         .select('-__v')
         // .populate('postedBy' as keyof IPost, '-password -__v -posts')
         .sort({ createdAt: '-1' })
         .exec();
      res.send(posts);
   });
});
