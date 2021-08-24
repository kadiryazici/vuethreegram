import { CookieSerializeOptions } from 'cookie';

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
      expireTime: process.env.MODE === 'dev' ? '1m' : '15m',
      refreshTokenExpireTime: process.env.MODE === 'dev' ? '2m' : '7d'
   },
   cookies: {
      jwtName: 'jwt',
      refreshTokenName: 'ref_jwt',
      jwtOptions: {
         httpOnly: true,
         sameSite: 'strict',
         secure: true,
         path: '/',
         maxAge: 2147483647
      } as CookieSerializeOptions
   }
} as const);

function deepFreeze<T extends Record<string, any>>(o: T): T {
   Object.freeze(o);
   if (o === undefined) {
      return o;
   }

   Object.getOwnPropertyNames(o).forEach(function (prop) {
      if (
         o[prop] !== null &&
         (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
         !Object.isFrozen(o[prop])
      ) {
         deepFreeze(o[prop]);
      }
   });

   return o;
}
