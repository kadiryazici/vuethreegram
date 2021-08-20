import Koa from 'koa';
import c2k from 'koa-connect';
// import Router from '@koa/router';
import { createSsrServer } from 'vite-ssr/dev';
import path from 'node:path';
import dotenv from 'dotenv';
import fg from 'fast-glob';
import { initClient } from './inits/initClient';
import Router from '@koa/router';
import { filePath2Path } from './uilts/filePath2Path';
import { KoaServer } from './types';

dotenv.config();
const router = new Router();
const app = new Koa();

export type Server = typeof app;
export type AppRouter = typeof router;

async function createServer() {
   // auto importing routes
   const entries = await fg('./routes/**/*.path.js', { cwd: __dirname });
   for (const path of entries) {
      const route = filePath2Path(path);
      const { setRoute }: KoaServer.PathFile = await import(path);
      await setRoute(app, router, route);
   }

   app.use(router.routes()).use(router.allowedMethods());
   const port = process.env.PORT || 3000;
   app.listen(port, () => {
      console.log(`App is up on ${port}`);
   });
}
createServer();
export default app.callback();
