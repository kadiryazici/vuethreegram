import { Handler, Response } from 'express';
import { ThrowRequest, removeJWTCookies } from '$utils/api';
import { createJWT, isExpired, isInvalid, verifyJWT } from '$utils/jwt';
import { devLog, devLogError } from '$utils/devLog';

import { Api } from '@/types';
import { Constant } from '$const/index';
import { ErrorType } from '$const/errorTypes';
import { Msg } from '$const/msg';
import { RefreshTokensModel } from '$models/RefreshTokens.model';
import { UsersModel } from '$models/User.model';
import cookie from 'cookie';
import { usePromise } from 'vierone';

const ThrowUnauthorized = (res: Response) =>
   ThrowRequest(res, {
      message: Msg.Unauthorized,
      type: ErrorType.Unauthorized,
      status: 'Unauthorized'
   });
const ThrowInternalServerError = (res: Response) =>
   ThrowRequest(res, {
      message: Msg.UnexpectedError,
      type: ErrorType.UnexpectedError,
      status: 'InternalServerError'
   });

/**
 * This is auth middleware it checks jwt cookie for authentication
 * if jwt or refresh token is invalid, it deletes cookies and sends Unatuhorized
 * if jwt is expierd but refresh token is viable, refreshes jwt and refresh token automatically
 * after checking refresh_token in database and then passes user to route
 */
export const mw_AutoRefreshTokenAndPassUser: Handler = async (req, res, next) => {
   const { jwtName, refreshTokenName } = Constant.cookies;

   const cookies = cookie.parse(req.headers.cookie || '') as Api.CookiePayload;
   if (!cookies || !cookies[jwtName]) {
      return next();
   }

   const [jwtPayload, jwtError] = await usePromise(verifyJWT<Api.JWTBody>(cookies[jwtName], process.env.JWT_SECRET));
   const [refJWTPayload, refJWTError] = await usePromise(
      verifyJWT<Api.JWTBody>(cookies[refreshTokenName], process.env.JWT_REFRESH_SECRET)
   );

   // check if tokens are invalid
   const isTokenInvalid = isInvalid(jwtError);
   const isRefreshInvalid = isInvalid(refJWTError);
   if (isTokenInvalid) {
      console.log({
         isTokenInvalid
      });
      return next();
   }

   // if tokens are not invalid check for expiration
   const isJWTExpired = isExpired(jwtError);
   const isRefreshExpired = isExpired(refJWTError);
   if (isJWTExpired) {
      if (isJWTExpired && !isRefreshExpired && !isRefreshInvalid) {
         const isRefreshTokenSigned = await RefreshTokensModel.exists({ token: cookies[refreshTokenName] });
         if (!isRefreshTokenSigned) {
            return next();
         }

         const id = refJWTPayload?.id;
         if (!id) {
            return next();
         }

         const foundUser = await UsersModel.findOne({ _id: id }).select('-password -__v').exec();
         if (!foundUser) {
            return next();
         }

         try {
            await RefreshTokensModel.deleteOne({ token: cookies.ref_jwt });
         } catch {
            return ThrowInternalServerError(res);
         }

         const newJWT = await createJWT({ id }, process.env.JWT_SECRET, {
            expiresIn: Constant.token.expireTime
         });
         const newRefreshJWT = await createJWT({ id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: Constant.token.refreshTokenExpireTime
         });

         const JWTModel = new RefreshTokensModel({ token: newRefreshJWT });
         const [, jwtSaveError] = await usePromise(JWTModel.save());
         if (jwtSaveError) {
            return ThrowInternalServerError(res);
         }

         const { jwtOptions } = Constant.cookies;
         res.cookie(jwtName, newJWT, jwtOptions);
         res.cookie(refreshTokenName, newRefreshJWT, jwtOptions);

         req.user = foundUser;
         return next();
      }

      return next();
   }

   const foundUser = await UsersModel.findOne({ _id: jwtPayload!.id }).select('-password -__v').exec();
   if (!foundUser) {
      removeJWTCookies(res);
      return ThrowUnauthorized(res);
   }
   req.user = foundUser;
   next();
};

export const mw_AuthNeeded: Handler = (req, res, next) => {
   if (req.user) {
      return next();
   }

   return ThrowRequest(res, {
      message: Msg.Unauthorized,
      type: ErrorType.Unauthorized,
      status: 'Unauthorized'
   });
};

export const mw_NoAuthNeeded: Handler = (req, res, next) => {
   if (req.user) {
      return ThrowRequest(res, {
         message: Msg.AuthError,
         status: 'BadRequest',
         type: ErrorType.AuthError
      });
   }
   return next();
};
