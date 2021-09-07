import { CookieSerializeOptions } from 'cookie';
import type { ServeStaticOptions } from 'serve-static';
import { deepFreeze } from '$utils/deepFreeze';

export const Constant = deepFreeze({
   bcryptSalt: 10,
   user: {
      username: {
         min: 3,
         max: 15
      },
      password: {
         min: 6,
         max: 25
      }
   },
   token: {
      expireTime: '15m',
      refreshTokenExpireTime: '7d'
   },
   cookies: {
      jwtName: 'jwt',
      refreshTokenName: 'ref_jwt',
      jwtOptions: {
         httpOnly: true,
         sameSite: 'strict',
         secure: true,
         path: '/',
         maxAge: 21474836
      } as CookieSerializeOptions
   },
   post: {
      maxImageSize: 1024 * 1024 * 5,
      supportedMimeTypes: ['image/png', 'image/jpeg'] as string[],
      imgStartUrl: '/postimg'
   },
   expressStaticOptions: {
      maxAge: '1d'
   } as ServeStaticOptions
} as const);
