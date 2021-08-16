import { filePath2Path } from '@/helpers/api';
import { prettyLog } from '@/helpers/prettyLog';
import { Api } from '@/types';
import chalk from 'chalk';
import { FastifyServer } from '..';
// @ts-expect-error
import * as glob from '../routes/**/*.path.ts';

const { default: routes, filenames } = glob as Api.InstallGlob;

export async function useRoutes(server: FastifyServer) {
   for (const [index, route] of routes.entries()) {
      const path = filePath2Path(filenames[index]);
      route.use && prettyLog(path, 'has been registered.');
      await route.use?.(server, path);
   }
}
