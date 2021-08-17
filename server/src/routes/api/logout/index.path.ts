import { useAuthGuard } from '@/guards/authGuard';
import { useCsrfGuard } from '@/guards/csrfGuard';
import { Success } from '@/helpers/request';
import { Api } from '@/types';
import { FastifyRequest, FastifyReply } from 'fastify';
import cookie, { CookieSerializeOptions } from 'cookie';
import { JWTConfig } from '@/constants';
import { useDB } from '@/db';
import { removeRefreshTokenFromDB } from '@/helpers/db';

const Settings: CookieSerializeOptions = {
   maxAge: 1
};

const Post = async (req: FastifyRequest, reply: FastifyReply) => {
   await useCsrfGuard(req);
   const { ref_token } = await useAuthGuard(req);

   const deleteJWTCookie = cookie.serialize(
      JWTConfig.jwtCookieName,
      '',
      Settings
   );
   const deleteRefreshTokenCookie = cookie.serialize(
      JWTConfig.refreshCookieName,
      '',
      Settings
   );

   console.log({
      ref_token
   });
   await removeRefreshTokenFromDB(ref_token ?? 'qwe');

   reply.header('Set-Cookie', deleteJWTCookie);
   reply.header('Set-Cookie', deleteRefreshTokenCookie);

   return Success('başarıyla çıkış yapıldı');
};

export const use: Api.use = async (server, path) => {
   server.post(path, Post);
};
