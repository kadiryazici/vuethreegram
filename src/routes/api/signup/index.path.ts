import { Api, ExpressServer } from '@/types';
import { Handler, Request, Response } from 'express';
import { Success, ThrowRequest, defineRoute } from '$utils/api';

import { Constant } from '$const/index';
import { ErrorType } from '$const/errorTypes';
import { Msg } from '$const/msg';
import { UsersModel } from '$models/User.model';
import bcrypt from 'bcrypt';
import { csrfGuard } from '@/middlewares/csrf';
import { mw_NoAuthNeeded } from '@/middlewares/auth';
import { usePromise } from 'vierone';
import { validateAuthBody } from '$validators/user.validator';

export const setRoute = defineRoute(async (app, path) => {
   app.post(path, mw_NoAuthNeeded, csrfGuard, Post());
});

function Post(): Handler {
   return async (req, res) => {
      let { username, password } = req.body as Api.UserPayload;

      const [newBody, validateError] = await usePromise(validateAuthBody({ username, password }));
      if (validateError) {
         return ThrowRequest(res, {
            status: 'BadRequest',
            message: Msg.AuthError,
            type: ErrorType.AuthError
         });
      }
      username = newBody!.username;
      password = newBody!.password;

      const [hashedPassword, hashError] = await usePromise(bcrypt.hash(password, Constant.bcryptSalt));
      if (hashError) {
         return ThrowRequest(res, {
            message: Msg.UnexpectedError,
            status: 'InternalServerError',
            type: ErrorType.UnexpectedError
         });
      }
      password = hashedPassword!;

      const foundUser = await UsersModel.findOne({ username });
      if (foundUser) {
         return ThrowRequest(res, {
            status: 'Conflict',
            message: Msg.UserAlreadyExists,
            type: ErrorType.UserAlreadyExists
         });
      }

      const user = new UsersModel({ username, password });
      const [, userError] = await usePromise(user.save());
      if (userError)
         return ThrowRequest(res, {
            message: Msg.UnexpectedError,
            status: 'InternalServerError',
            type: ErrorType.UnexpectedError
         });

      return Success(res);
   };
}
