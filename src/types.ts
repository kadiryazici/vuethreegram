import { AppRouter, Server } from '.';

declare global {
   namespace NodeJS {
      export interface ProcessEnv {
         JWT_SECRET: string;
         JWT_REFRESH_SECRET: string;
         PORT: number;
         MODE: 'prod' | 'dev';
      }
   }
}

export namespace KoaServer {
   export type app = Server;

   export type SetRoute = (koa: Server, router: AppRouter, path: string) => Promise<void>;
   export type PathFile = {
      setRoute: SetRoute;
   };
}
