import { trimChars } from '$utils/trimChars';

const PathParameterRegex = /\[(.*?)\]/g;
const pathStartsWith = './routes';

/**
 * Converts file path to http path
 * @example ```/routes/api/[id]/index.path.ts``` --> `/api/:id/`
 * @example ```'/routes/api/user/[id].path.ts``` -->  ```/api/user/:id```
 * @example ```'/routes/api/user/[...].path.ts``` -->  ```/api/user/(.*)```
 * @example ```'/routes/something.path.ts``` -->  ```/something```
 */
export function filePath2Path(str: string) {
   str = removeExtension(str);
   str = removeIndexName(str);
   str = str.replace(PathParameterRegex, (target, param: string) => {
      if (param.startsWith('...')) {
         return '*';
      }
      return `:${param}`;
   });
   str = trimChars(str, '.');

   //path always starts with /routes, I should delete it.
   str = '/' + str.slice(pathStartsWith.length, str.length);
   return str;
}

function removeExtension(str: string) {
   return str.replace('.path.js', '');
}

function removeIndexName(str: string) {
   let arr = str.split('/');
   arr = arr.filter((name) => name !== 'index');
   return arr.join('/');
}
