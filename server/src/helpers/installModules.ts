import { Api } from '@/types';
import chalk from 'chalk';
import { FastifyServer } from '..';
//@ts-ignore
import * as glob from '../modules/**/*';

const { default: modules } = glob as Api.ModuleGlob;

export async function installModules(server: FastifyServer) {
   for (const module of modules) {
      module.install && module.name && installLog(module.name);
      await module.install?.(server);
   }
}

export function installLog(head: string) {
   const $head = chalk.magentaBright(head);
   const $body = chalk.cyan('module has been installed.');
   const text = chalk.whiteBright(`[${$head}] ${$body}`);
   console.log(text);
}
