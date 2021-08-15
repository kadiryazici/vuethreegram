export function trimChars(str: string, chars: string | string[]) {
   var start = 0,
      end = str.length;

   while (start < end && chars.indexOf(str[start]) >= 0) ++start;

   while (end > start && chars.indexOf(str[end - 1]) >= 0) --end;

   return start > 0 || end < str.length ? str.substring(start, end) : str;
}

export const deepFreeze = (obj: Record<string, any>) => {
   Object.keys(obj).forEach((prop) => {
      if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop]))
         deepFreeze(obj[prop]);
   });
   return Object.freeze(obj);
};

import { dirname } from 'path';
import { fileURLToPath } from 'url';

export function dirName() {
   return dirname(fileURLToPath(import.meta.url));
}

export function removeSpaceDuplications(str: string) {
   return str.replace(/\s\s+/g, '');
}
