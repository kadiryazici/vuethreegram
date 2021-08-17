import { useDB } from '@/db';

export async function doesUserExists(uname: string) {
   const db = useDB();
   const user = db.data?.users.find((v) => {
      return v.username === uname;
   });
   if (user) {
      return user;
   }
   return false;
}

export async function removeRefreshTokenFromDB(token: string) {
   const db = useDB();
   if (!db.data) {
      throw 'db is null';
   }
   const { refreshTokens } = db.data;
   if (refreshTokens.length > 1) {
      const tokenIndex = refreshTokens.findIndex((t) => t === token);
      refreshTokens[tokenIndex] = refreshTokens.pop()!;
   } else {
      refreshTokens.pop();
   }
   await db.write();
}
