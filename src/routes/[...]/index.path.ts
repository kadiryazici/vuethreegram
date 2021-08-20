import { createSsrServer } from 'vite-ssr/dev';
import path from 'node:path';
import c2k from 'koa-connect';
import { AppRouter, Server } from '../..';
import serve from 'koa-static';
import mount from 'koa-mount';
import Koa from 'koa';
import Router from '@koa/router';
import type { OutgoingHttpHeaders, OutgoingHttpHeader } from 'http';
import { KoaServer } from '../../types';

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
         request: any;
         response: any;
         ctx: Koa.ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>;
      }>
   ) => Promise<{
      html: string;
      status: number;
      statusText: string;
      headers: OutgoingHttpHeaders | OutgoingHttpHeader[];
   }>;
};

export const setRoute: KoaServer.SetRoute = async (app, router, routePath) => {
   if (process.env.MODE === 'prod') {
      const assetsPath = path.join(process.cwd() + '/prod/client/assets');
      //@ts-ignore
      const manifest: SSRManifest = await import('../client/server/ssr-manifest.json');
      // @ts-ignore
      const { default: renderer }: Renderer = await import('../client/server/main.js');
      app.use(mount('/assets', serve(assetsPath)));

      router.get(routePath, async (ctx) => {
         const url = `${ctx.protocol}://${ctx.host}${ctx.originalUrl}`;
         try {
            const { html } = await renderer(url, {
               ctx,
               preload: true,
               manifest
            });
            ctx.type = 'html';
            ctx.body = html;
         } catch (err) {
            console.log(err);
            ctx.throw('an error happened while rendering page');
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
   viteServer.middlewares;
   app.use(c2k(viteServer.middlewares));
};
