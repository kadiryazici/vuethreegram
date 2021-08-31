import { Api } from '@/types';
import { Request, Response } from 'express';
import { UsersModel } from '$models/User.model';
import bcrypt from 'bcrypt';
import { usePromise } from 'vierone';
import { createJWT } from '$utils/jwt';
import { Constant } from '$const/index';
import { RefreshTokensModel } from '$models/RefreshTokens.model';
import { defineRoute, Success, ThrowRequest } from '$utils/api';
import { Msg } from '$const/msg';
import { validateAuthBody } from '$validators/user.validator';
import cookie from 'cookie';

export const setRoute = defineRoute(async (app, path) => {
   app.post(path, Post);
});

async function Post(req: Request, res: Response) {
   let { username, password } = req.body as Api.UserPayload;

   const [newBody, validationError] = await usePromise(validateAuthBody({ username, password }));
   if (validationError) {
      return ThrowRequest(res, 'BadRequest', Msg.AuthError);
   }
   username = newBody!.username;
   password = newBody!.password;

   const foundUser = await UsersModel.findOne({ username });
   if (!foundUser) {
      return ThrowRequest(res, 'NotFound', Msg.AuthError);
   }

   const [isValidPassword] = await usePromise(bcrypt.compare(password, foundUser.password));
   if (!isValidPassword) {
      return ThrowRequest(res, 'NotFound', Msg.AuthError);
   }

   const token = await createJWT({ id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: Constant.token.expireTime
   });
   const refreshToken = await createJWT({ id: foundUser._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: Constant.token.refreshTokenExpireTime
   });

   const _ref = new RefreshTokensModel({ token: refreshToken });
   const [, refreshTokenSaveError] = await usePromise(_ref.save());
   if (refreshTokenSaveError) {
      return ThrowRequest(res, 'InternalServerError', Msg.UnexpectedError);
   }
   const { jwtName, refreshTokenName } = Constant.cookies;
   const newJWTCookie = cookie.serialize(jwtName, token, Constant.cookies.jwtOptions);
   const newRefreshJWTCookie = cookie.serialize(refreshTokenName, refreshToken, Constant.cookies.jwtOptions);
   res.setHeader('Set-Cookie', [newJWTCookie, newRefreshJWTCookie]);
   return Success(res);
}
