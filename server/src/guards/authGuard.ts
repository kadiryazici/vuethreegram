import { FastifyRequest } from 'fastify';
import cookie from 'cookie';
import httpErrors from 'http-errors';
import { JWTConfig } from '@/constants';
import { validateAuth } from '@/validators/authValidator';
import { Api } from '@/types';
import { verifyJWT } from '@/helpers/jwt';

export async function useAuthGuard(
   req: FastifyRequest,
   validateRefresh = false
) {
   if (!req.headers.cookie) throw new httpErrors.BadRequest('cookies needed');
   const cookies = cookie.parse(req.headers.cookie);

   const tokenPayload: Api.TokenPayload = {
      [JWTConfig.jwtCookieName]: cookies[JWTConfig.jwtCookieName],
      [JWTConfig.refreshCookieName]: cookies[JWTConfig.refreshCookieName]
   };

   await validateAuth(tokenPayload, validateRefresh);

   const jwtPayload = await verifyJWT<Api.UserJWTPayload>(
      cookies[JWTConfig.jwtCookieName],
      process.env.JWT_SECRET
   );

   const payload: Api.TokenPayload & Api.UserJWTPayload = {
      id: jwtPayload.id,
      ...tokenPayload
   };
   return payload;
}
