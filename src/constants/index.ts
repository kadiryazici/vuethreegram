export const Constant = Object.freeze({
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
      expireTime: '20m',
      refreshTokenExpireTime: '7d'
   }
});
