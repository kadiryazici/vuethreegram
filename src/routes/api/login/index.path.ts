import { Api } from '@/types';
import { Handler, Request, Response } from 'express';
import { UsersModel } from '$models/User.model';
import bcrypt from 'bcrypt';
import { usePromise } from 'vierone';
import { createJWT } from '$utils/jwt';
import { Constant } from '$const/index';
import { RefreshTokensModel } from '$models/RefreshTokens.model';
import { defineRoute, Success, ThrowRequest } from '$utils/api';
import { Msg } from '$const/msg';
import { validateAuthBody } from '$validators/user.validator';
import { ErrorType } from '$const/errorTypes';
import { csrfGuard } from '@/middlewares/csrf';

export const setRoute = defineRoute(async (app, path) => {
   app.post(path, csrfGuard, Post());
});

function Post(): Handler {
   return async (req, res) => {
      let { username, password } = req.body as Api.UserPayload;

      const [newBody, validationError] = await usePromise(validateAuthBody({ username, password }));
      if (validationError) {
         return ThrowRequest(res, {
            status: 'BadRequest',
            message: Msg.AuthError,
            type: ErrorType.AuthError
         });
      }
      username = newBody!.username;
      password = newBody!.password;

      const foundUser = await UsersModel.findOne({ username }).exec();
      console.log({ foundUser });
      if (!foundUser) {
         return ThrowRequest(res, {
            status: 'NotFound',
            message: Msg.AuthError,
            type: ErrorType.AuthError
         });
      }

      const [isValidPassword] = await usePromise(bcrypt.compare(password, foundUser.password));
      if (!isValidPassword) {
         return ThrowRequest(res, {
            status: 'NotFound',
            message: Msg.AuthError,
            type: ErrorType.AuthError
         });
      }

      const tokenPayload = { id: foundUser._id };
      const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
      const { expireTime, refreshTokenExpireTime } = Constant.token;
      const token = await createJWT(tokenPayload, JWT_SECRET, { expiresIn: expireTime });
      const refreshToken = await createJWT(tokenPayload, JWT_REFRESH_SECRET, { expiresIn: refreshTokenExpireTime });

      const _ref = new RefreshTokensModel({ token: refreshToken });
      const [, refreshTokenSaveError] = await usePromise(_ref.save());
      if (refreshTokenSaveError) {
         return ThrowRequest(res, {
            status: 'InternalServerError',
            message: Msg.UnexpectedError,
            type: ErrorType.UnexpectedError
         });
      }

      const { jwtName, refreshTokenName } = Constant.cookies;
      res.cookie(jwtName, token, Constant.cookies.jwtOptions);
      res.cookie(refreshTokenName, refreshToken, Constant.cookies.jwtOptions);

      return res.status(200).send({
         username: foundUser.username,
         userID: foundUser._id
      } as Api.LoginResponse);
   };
}
