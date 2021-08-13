import { dirname } from 'path';
import { fileURLToPath } from 'url';

export function dirName() {
   return dirname(fileURLToPath(import.meta.url));
}
