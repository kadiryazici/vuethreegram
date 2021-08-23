import 'reflect-metadata';

import dotenv from 'dotenv';
import fg from 'fast-glob';
import { filePath2Path } from './utils/filePath2Path';
import { ExpressServer } from './types';
import express from 'express';
import { initDB } from './db';
dotenv.config();

const app = express();

async function createServer() {
   await initDB();
   app.use(express.json());
   // auto importing routes
   let entries = await fg('./routes/**/*.path.js', { cwd: __dirname });
   const routesWithStars = entries.filter((route) => route.includes('[...]'));
   const normalRoutes = entries.filter((route) => !route.includes('[...]'));
   entries = [...normalRoutes, ...routesWithStars];
   for (const path of entries) {
      const route = filePath2Path(path);
      console.log({ route });
      const { setRoute }: ExpressServer.PathFile = await import(path);
      await setRoute?.(app, route);
   }

   const port = process.env.PORT || 3000;
   app.listen(port, async () => {
      console.log(`App is up on ${port}`);
   });
}
createServer();

export default app;
export type Server = typeof app;
