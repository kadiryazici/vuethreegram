import { useAuthGuard } from '@/guards/authGuard';
import { useCsrfGuard } from '@/guards/csrfGuard';
import { Success } from '@/helpers/request';
import { Api } from '@/types';
import { FastifyRequest, FastifyReply } from 'fastify';
import cookie, { CookieSerializeOptions } from 'cookie';
import { JWTConfig } from '@/constants';
import { useDB } from '@/db';

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

   const db = useDB();
   const filteredRefreshTokens = db.data?.refreshTokens.filter(
      (token) => token !== ref_token
   );
   if (filteredRefreshTokens) {
      db.data!.refreshTokens = filteredRefreshTokens;
      await db.write();
   }

   reply.header('Set-Cookie', deleteJWTCookie);
   reply.header('Set-Cookie', deleteRefreshTokenCookie);

   return Success('başarıyla çıkış yapıldı');
};

export const use: Api.use = async (server, path) => {
   server.post(path, Post);
};
