import { FilePathParameterRegex } from '@/constants';
import { trimChars } from '@/helpers/utility';

/**
 * Converts file path to http path
 * @example ```/api/[id]/index.ts``` --> `/api/:id/`
 * @example ```'api/user/[id].ts``` -->  ```/api/user/:id```
 * @example ```'api/user/[...].ts``` -->  ```/api/user/*```
 */
export function filePath2Path(str: string) {
   str = removeExtension(str);
   str = removeIndexName(str);
   str = str.replace(FilePathParameterRegex, (target, param: string) => {
      if (param.startsWith('...')) {
         return '*';
      }
      return `:${param}`;
   });
   str = trimChars(str, '.');
   return str;
}

function removeExtension(str: string) {
   const arr = str.split('.');
   arr.pop();
   return arr.join('.');
}

function removeIndexName(str: string) {
   let arr = str.split('/');
   arr = arr.filter((name) => name !== 'index');
   return arr.join('/');
}
