import {
   createAuthToken,
   createJWT,
   createRefreshToken,
   verifyJWT
} from '@/helpers/jwt';
import { Api } from '@/types';
import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import httpErrors from 'http-errors';
import { validateAuthBody } from '@/validators/validateAuthBody';
import { useDB } from '@/db';
import { doesUserExists } from '@/helpers/db';
import cookie, { CookieSerializeOptions } from 'cookie';
import { JWTConfig } from '@/constants';
import { Success } from '@/helpers/request';

const invalidPasswordOrUsername = 'invalid password or username';
const unexpectedError = 'an unexpected error occured';

const Post = async (req: FastifyRequest, res: FastifyReply) => {
   const body = await validateAuthBody(req.body as Api.AuthBody).catch(() => {
      throw new httpErrors.BadRequest('invalid request body');
   });

   const user = await doesUserExists(body.username);
   if (!user) {
      return new httpErrors.Unauthorized(invalidPasswordOrUsername);
   }

   const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
   if (!isPasswordCorrect) {
      return new httpErrors.Unauthorized(invalidPasswordOrUsername);
   }

   const tokenError = () => {
      throw new httpErrors.InternalServerError(unexpectedError);
   };
   const jwt = await createAuthToken(user.id).catch(tokenError);
   const refreshToken = await createRefreshToken(user.id).catch(tokenError);

   const settings: CookieSerializeOptions = {
      httpOnly: true,
      sameSite: 'strict'
   };
   const jwtCookie = cookie.serialize(JWTConfig.jwtCookieName, jwt, settings);
   const refreshCookie = cookie.serialize(
      JWTConfig.refreshCookieName,
      refreshToken,
      settings
   );

   {
      const db = useDB();
      db.data?.refreshTokens.push(refreshToken);
      db.write();
   }

   res.header('Set-Cookie', jwtCookie);
   res.header('Set-Cookie', refreshCookie);

   return Success();
};

export const use: Api.use = async (server, path) => {
   server.post(path, Post);
};
