import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const dirName = () => {
   return dirname(fileURLToPath(import.meta.url));
};
