import { Response, Request } from 'express';
import { UsersModel } from '$models/User.model';
import { Api, ExpressServer } from '@/types';
import bcrypt from 'bcrypt';
import { Constant } from '$const/index';
import { validateAuthBody } from '$validators/user.validator';
import { usePromise } from 'vierone';
import { Msg } from '$const/msg';
import { defineRoute, Success, ThrowRequest } from '$utils/api';

export const setRoute = defineRoute(async (app, path) => {
   app.post(path, Post);
});

async function Post(req: Request, res: Response) {
   let { username, password } = req.body as Api.UserPayload;

   const [newBody, validateError] = await usePromise(validateAuthBody({ username, password }));
   if (validateError) {
      return ThrowRequest(res, 'BadRequest', Msg.AuthError);
   }
   username = newBody!.username;
   password = newBody!.password;

   const [hashedPassword, hashError] = await usePromise(bcrypt.hash(password, Constant.bcryptSalt));
   if (hashError) {
      return ThrowRequest(res, 'InternalServerError', Msg.UnexpectedError);
   }
   password = hashedPassword!;

   const foundUser = await UsersModel.findOne({ username });
   if (foundUser) {
      return ThrowRequest(res, 'Conflict', Msg.UserAlreadyExists);
   }

   const user = new UsersModel({ username, password });
   const [, userError] = await usePromise(user.save());
   if (userError) return ThrowRequest(res, 'InternalServerError', Msg.UnexpectedError);

   return Success(res, 'Accepted');
}
