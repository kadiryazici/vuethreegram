import path from 'node:path';
import express, { Request, Response } from 'express';
import { defineRoute } from '$utils/api';

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
   }>;
};

export const setRoute = defineRoute(async (app, routePath) => {
   if (process.env.MODE === 'prod') {
      const assetsPath = path.join(process.cwd() + '/prod/client/public');
      //@ts-ignore
      const manifest: SSRManifest = await import('../../client/server/ssr-manifest.json');
      // @ts-ignore
      const { default: renderer }: Renderer = await import('../../client/server/main.js');
      app.use('/', express.static(assetsPath));

      app.get(routePath, async (request, response) => {
         const url = `${request.protocol}://${request.hostname}${request.originalUrl}`;
         try {
            const { html } = await renderer(url, {
               preload: true,
               manifest,
               request,
               response
            });
            response.status(200).send(html);
         } catch (err) {
            console.log(err);
            response.status(500).send('Server Error');
         }
      });

      return;
   }

   const { createSsrServer } = await import('vite-ssr/dev');
   // if dev mode run vite server as middlewares
   const viteServer = await createSsrServer({
      server: {
         middlewareMode: 'ssr'
      },
      root: path.resolve(process.cwd(), './client')
   });

   app.use(viteServer.middlewares);
});
