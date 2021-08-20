import { createSsrServer } from 'vite-ssr/dev';
import path from 'node:path';
import type { OutgoingHttpHeaders, OutgoingHttpHeader } from 'http';
import { ExpressServer } from '../../types';
import express, { Request, Response } from 'express';

interface ServerPackageJson {
   type: string;
   main: string;
   ssr: {
      assets: string[];
   };
}
type SSRManifest = Record<string, string[]>;
type Renderer = {
   default: (
      url: string,
      options: Partial<{
         manifest: SSRManifest;
         preload: boolean;
         initialState: Record<string, any>;
         request: Request;
         response: Response;
      }>
   ) => Promise<{
      html: string;
      status: number;
      statusText: string;
      headers: OutgoingHttpHeaders | OutgoingHttpHeader[];
   }>;
};

export const setRoute: ExpressServer.SetRoute = async (app, routePath) => {
   if (process.env.MODE === 'prod') {
      const assetsPath = path.join(process.cwd() + '/prod/client/assets');
      //@ts-ignore
      const manifest: SSRManifest = await import('../../client/server/ssr-manifest.json');
      // @ts-ignore
      const { default: renderer }: Renderer = await import('../../client/server/main.js');
      app.use('/assets', express.static(assetsPath));

      app.get(routePath, async (request, response) => {
         const url = `${request.protocol}://${request.hostname}${request.originalUrl}`;
         try {
            const { html } = await renderer(url, {
               preload: true,
               manifest,
               request,
               response
            });
            response.send(html);
         } catch (err) {
            console.log(err);
            response.status(500).send('Server Error');
         }
      });

      return;
   }

   // if dev mode run vite server as middlewares
   const viteServer = await createSsrServer({
      server: {
         middlewareMode: 'ssr'
      },
      root: path.resolve(process.cwd(), './client')
   });

   app.use(viteServer.middlewares);
};
