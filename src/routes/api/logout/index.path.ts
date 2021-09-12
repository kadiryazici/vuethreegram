import { Success, defineRoute } from '$utils/api';

import { Constant } from '$const/index';
import { Handler } from 'express';
import { RefreshTokensModel } from '$models/RefreshTokens.model';
import cookie from 'cookie';
import { csrfGuard } from '@/middlewares/csrf';
import { usePromise } from 'vierone';

export const setRoute = defineRoute(async (app, path) => {
   app.post(path, csrfGuard, Post());
});

function Post(): Handler {
   return async (req, res) => {
      const { jwtName, refreshTokenName } = Constant.cookies;
      res.clearCookie(jwtName);
      res.clearCookie(refreshTokenName);

      if (req.headers.cookie) {
         const cookies = cookie.parse(req.headers.cookie);
         const refCookie = cookies[refreshTokenName];
         if (refCookie) {
            await usePromise(RefreshTokensModel.deleteOne({ token: refCookie }).exec());
         }
      }

      return Success(res);
   };
}
