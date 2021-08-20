import Koa from 'koa';
import c2k from 'koa-connect';
// import Router from '@koa/router';
import { createSsrServer } from 'vite-ssr/dev';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();
// const router = new Router();

async function createServer() {
   const app = new Koa();
   const viteServer = await createSsrServer({
      server: {
         middlewareMode: 'ssr'
      },
      root: path.resolve(process.cwd(), './client')
   });
   viteServer.middlewares;
   app.use(c2k(viteServer.middlewares));
   // app.use(async (ctx) => {});
   app.listen(7000, () => {
      console.log('App is up 3000');
   });
}
createServer();
