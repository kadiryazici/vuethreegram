import { prettyLog } from '@/helpers/prettyLog';
import { Api } from '@/types';
import chalk from 'chalk';
import { FastifyServer } from '..';
//@ts-ignore
import * as glob from '../modules/**/*';

const { default: modules } = glob as Api.ModuleGlob;

export async function installModules(server: FastifyServer) {
   for (const module of modules) {
      module.install &&
         module.name &&
         prettyLog(module.name, 'has been installed.');
      await module.install?.(server);
   }
}
