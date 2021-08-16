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
