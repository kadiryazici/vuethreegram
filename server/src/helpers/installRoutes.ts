import { filePath2Path } from '@/helpers/api';
import { Api } from '@/types';
import chalk from 'chalk';
import { FastifyServer } from '..';
// @ts-expect-error
import * as glob from '../api/**/*';

const { default: routes, filenames } = glob as Api.InstallGlob;

export async function useRoutes(server: FastifyServer) {
   for (const [index, route] of routes.entries()) {
      const path = filePath2Path(filenames[index]);
      route.use && routeLog(path);
      await route.use?.(server, path);
   }
}

function routeLog(path: string) {
   const $head = chalk.whiteBright(`{${chalk.magentaBright(path)}}`);
   const $body = chalk.cyan('route has been registered.');
   console.log(`${$head} ${$body}`);
}
