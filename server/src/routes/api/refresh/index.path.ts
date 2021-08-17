import { useAuthGuard } from '@/guards/authGuard';
import { useCsrfGuard } from '@/guards/csrfGuard';
import { createJWT } from '@/helpers/jwt';
import { Success } from '@/helpers/request';
import { Api } from '@/types';
import { FastifyRequest, FastifyReply, FastifySchema } from 'fastify';
import cookie, { CookieSerializeOptions } from 'cookie';
import { JWTConfig } from '@/constants';

const cookieSettings: CookieSerializeOptions = {
   httpOnly: true,
   sameSite: 'strict'
};

const Post = async (req: FastifyRequest, reply: FastifyReply) => {
   await useCsrfGuard(req);
   const { id } = await useAuthGuard(req, true);

   const newJWT = await createJWT({ id }, process.env.JWT_SECRET);
   const newRefreshToken = await createJWT(
      { id },
      process.env.JWT_REFRESH_SECRET
   );

   const jwtCookie = cookie.serialize(
      JWTConfig.jwtCookieName,
      newJWT,
      cookieSettings
   );
   const refreshCookie = cookie.serialize(
      JWTConfig.refreshCookieName,
      newRefreshToken,
      cookieSettings
   );

   reply.header('Set-Cookie', jwtCookie);
   reply.header('Set-Cookie', refreshCookie);

   return Success('successfully');
};

export const use: Api.use = async (server, path) => {
   server.post(path, Post);
};
