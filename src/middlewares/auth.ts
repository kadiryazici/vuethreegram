import { Handler } from 'express';
import cookie from 'cookie';
import { removeJWTCookies, Success, ThrowRequest } from '$utils/api';
import { Msg } from '$const/msg';
import { Constant } from '$const/index';
import { usePromise } from 'vierone';
import { createJWT, isExpired, isInvalid, verifyJWT } from '$utils/jwt';
import { Api } from '@/types';
import { RefreshTokensModel } from '$models/RefreshTokens.model';
import { devLog } from '$utils/devLog';
import { UsersModel } from '$models/User.model';

export const authGuard: Handler = async (req, res, next) => {
   const throwError = () => ThrowRequest(res, 'Unauthorized', Msg.Unauthorized);
   const { jwtName, refreshTokenName } = Constant.cookies;

   const cookies = cookie.parse(req.headers.cookie || '') as Api.CookiePayload;
   if (!cookies || !cookies[jwtName] || !cookies[refreshTokenName]) {
      devLog('!cookies || !cookies[jwtName] || !cookies[refreshTokenName]');
      return throwError();
   }

   const [jwtPayload, jwtError] = await usePromise(verifyJWT<Api.JWTBody>(cookies[jwtName], process.env.JWT_SECRET));
   const [refJWTPayload, refJWTError] = await usePromise(
      verifyJWT<Api.JWTBody>(cookies[refreshTokenName], process.env.JWT_REFRESH_SECRET)
   );

   // check if tokens are invalid
   const isTokenInvalid = isInvalid(jwtError);
   const isRefreshInvalid = isInvalid(refJWTError);
   if (isTokenInvalid) {
      devLog('isTokenInvalid');
      return throwError();
   }

   // if tokens are not invalid check for expiration
   const isJWTExpired = isExpired(jwtError);
   const isRefreshExpired = isExpired(refJWTError);
   if (isJWTExpired) {
      devLog('isJWTExpired');
      if (isJWTExpired && !isRefreshExpired && !isRefreshInvalid) {
         devLog('isJWTExpired && !isRefreshExpired');

         const id = refJWTPayload?.id;
         if (!id) {
            devLog('!id');
            return throwError();
         }

         const isIDValid = await UsersModel.exists({ id });
         if (!isIDValid) {
            devLog('!isIDValid');
            return throwError();
         }

         // Check database for refreshToken
         const isRefreshTokenSigned = await RefreshTokensModel.exists({ token: cookies[refreshTokenName] });
         if (!isRefreshTokenSigned) {
            devLog('!isRefreshTokenSigned');
            return throwError();
         }

         try {
            await RefreshTokensModel.deleteOne({ token: cookies.ref_jwt });
         } catch {
            return ThrowRequest(res, 'InternalServerError', Msg.UnexpectedError);
         }

         const newJWT = await createJWT({ id }, process.env.JWT_SECRET, {
            expiresIn: Constant.token.expireTime
         });
         const newRefreshJWT = await createJWT({ id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: Constant.token.refreshTokenExpireTime
         });
         const newJWTCookie = cookie.serialize(jwtName, newJWT, Constant.cookies.jwtOptions);
         const newRefreshJWTCookie = cookie.serialize(refreshTokenName, newRefreshJWT, Constant.cookies.jwtOptions);
         const JWTModel = new RefreshTokensModel({ token: newRefreshJWT });
         const [, jwtSaveError] = await usePromise(JWTModel.save());
         if (jwtSaveError) {
            return ThrowRequest(res, 'InternalServerError', Msg.UnexpectedError);
         }

         res.setHeader('Set-Cookie', [newJWTCookie, newRefreshJWTCookie]);
         req.userID = id;
         return next();
      }

      removeJWTCookies(res);
      return throwError();
   }

   devLog('authGuard no error occured');
   req.userID = refJWTPayload?.id;
   next();
};
