import dotenv from 'dotenv';
import fg from 'fast-glob';
import { filePath2Path } from './uilts/filePath2Path';
import { ExpressServer } from './types';

import express from 'express';

dotenv.config();
const app = express();

export type Server = typeof app;

async function createServer() {
   // auto importing routes
   const entries = await fg('./routes/**/*.path.js', { cwd: __dirname });
   for (const path of entries) {
      const route = filePath2Path(path);
      console.log({ route });
      const { setRoute }: ExpressServer.PathFile = await import(path);
      await setRoute(app, route);
   }

   const port = process.env.PORT || 3000;
   app.listen(port, () => {
      console.log(`App is up on ${port}`);
   });
}
createServer();
export default app;
