import { filePath2Path } from '@/helpers/api';
import { prettyLog } from '@/helpers/prettyLog';
import { trimChars } from '@/helpers/utility';
import { Api } from '@/types';
import chalk from 'chalk';
import { FastifyServer } from '..';
// @ts-expect-error
import * as glob from '../routes/**/*.path.ts';

const { default: routes, filenames } = glob as Api.InstallGlob;

export async function useRoutes(server: FastifyServer) {
   for (const [index, route] of routes.entries()) {
      const filePath = filenames[index];
      const path = filePath2Path(filePath);

      const filePathText = chalk.whiteBright(`${trimChars(filePath, '.')}`);
      if (route.use) {
         await route.use(server, path);
         prettyLog(path, `has been registered. ${filePathText}`);
      }
   }
}
