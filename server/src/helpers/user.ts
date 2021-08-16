import { removeSpaceDuplications } from '@/helpers/utility';

export function serializeUsername(uname: string) {
   uname = removeSpaceDuplications(uname);
   uname = uname.trim();
   return uname;
}
