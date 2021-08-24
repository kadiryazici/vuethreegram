import { removeSpaceDuplications } from '@/utils';

export function serializeUsername(uname: string) {
   uname = removeSpaceDuplications(uname);
   uname = uname.trim();
   return uname;
}
