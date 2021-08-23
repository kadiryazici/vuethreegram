import { Api, ExpressServer } from '../../../types';
import { Request, Response } from 'express';
import { UsersModel } from '../../../models/User.model';
import bcrypt from 'bcrypt';
import { usePromise } from 'vierone';
import { createJWT } from '../../../utils/jwt';
import { Constant } from '../../../constants';
import { RefreshTokensModel } from '../../../models/RefreshTokens.model';
import createError from 'http-errors';

export const setRoute: ExpressServer.SetRoute = async (app, path) => {
   app.post(path, Post);
};

const InvalidBody = 'invalid username or password';

async function Post(req: Request, res: Response) {
   let { username, password }: Api.UserPayload = req.body;

   const foundUser = await UsersModel.findOne({ username });
   if (!foundUser) {
      return res.status(400).send(new createError[400](InvalidBody));
   }

   const [data] = await usePromise(bcrypt.compare(password, foundUser.password));
   if (!data) {
      return res.status(400).send(InvalidBody + 'p');
   }

   const token = await createJWT({ id: foundUser.id }, process.env.JWT_SECRET, {
      expiresIn: Constant.token.expireTime
   });
   const refreshToken = await createJWT({ id: foundUser.id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: Constant.token.refreshTokenExpireTime
   });

   const _ref = new RefreshTokensModel({
      token: refreshToken
   });
   const [, refreshTokenSaveError] = await usePromise(_ref.save());
   if (refreshTokenSaveError) {
      res.status(200).send(InvalidBody);
   }
   return res.status(200).send({
      token,
      refreshToken
   });
}
