import { createCSRFToken } from '@/guards/csrfGuard';
import { Api } from '@/types';
import { readFile } from 'fs/promises';
import httpErrors from 'http-errors';
import { URL } from 'url';

const getHandler = () => '../clientfiles/main.cjs';

const manifest = JSON.parse(
   await readFile(
      new URL('../clientfiles/ssr-manifest.json', import.meta.url),
      'utf-8'
   )
);

// I need to get the path via a function to prevent esbuild bundling.
const {
   default: { default: renderer }
} = await import(getHandler());

export const use: Api.use = async (server, path) => {
   server.get(path, async (req, reply) => {
      try {
         const protocol = `${req.protocol}://`;
         const host = req.hostname;
         const path = req.url;
         const url = protocol + host + path;

         const { html, status, statusText, headers } = await renderer(url, {
            manifest,
            preload: true,
            request: req,
            response: reply,
            initialState: {
               csrf: createCSRFToken()
            }
         });

         reply.type('text/html');
         return html;
      } catch (error) {
         throw new httpErrors.InternalServerError(
            'an error happened while rendering page'
         );
      }
   });
};
