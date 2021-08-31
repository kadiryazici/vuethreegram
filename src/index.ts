import 'reflect-metadata';

import dotenv from 'dotenv';
import fg from 'fast-glob';
import { filePath2Path } from '$utils/filePath2Path';
import { ExpressServer } from '@/types';
import express, { Express } from 'express';
import { initDB } from '@/db';
import { CSRFMiddlewareGlobal, logCSRFToken } from '@/middlewares/csrf';
import cors from 'cors';
import { createJWT } from '$utils/jwt';
import { prettyLog } from '$utils/prettyLog';
import path from 'node:path';
import compression from 'compression';
import { Constant } from './constants';

dotenv.config();
const app: Express = express();

async function createServer() {
   await initDB();
   app.disable('x-powered-by');

   // app.use(express.)
   app.use(CSRFMiddlewareGlobal);
   app.use(compression());
   app.use(express.json());
   app.use(
      Constant.post.imgStartUrl,
      express.static(path.join(process.cwd(), 'imgstorage'), Constant.expressStaticOptions)
   );
   /*if (process.env.MODE === 'dev')*/ {
      app.use(
         cors({
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: 'X-CSRF-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
            credentials: true
         })
      );
   }

   if (process.env.MODE === 'dev') {
      setTimeout(async () => {
         const payload = { id: 'asdasqwe' };
         const { JWT_REFRESH_SECRET, JWT_SECRET } = process.env;
         const tempJWT = await createJWT(payload, JWT_SECRET, {
            expiresIn: '1m'
         });
         const tempRefreshJWT = await createJWT(payload, JWT_REFRESH_SECRET, {
            expiresIn: '2m'
         });
         prettyLog('TEMP_JWT', tempJWT);
         prettyLog('TEMP_JWT_REFRESH', tempRefreshJWT);
         logCSRFToken();
      }, 0);
   }

   // auto importing routes
   let entries = await fg('./routes/**/*.path.js', { cwd: __dirname });

   const routesWithStars = entries.filter((route) => route.includes('[...]'));
   const normalRoutes = entries.filter((route) => !route.includes('[...]'));
   entries = [...normalRoutes, ...routesWithStars];
   for (const path of entries) {
      const route = filePath2Path(path);
      const { setRoute }: ExpressServer.PathFile = await import(path);
      await setRoute?.(app, route);
   }

   const port = process.env.PORT || 3000;
   app.listen(port, async () => {
      prettyLog(process.env.MODE.toUpperCase(), `App is up on http://localhost:${port}`);
   });
}
createServer().catch((err) => {
   prettyLog('ERROR', 'An error happened while creating server');
   console.error(err);
});

export default app;
export type Server = typeof app;
