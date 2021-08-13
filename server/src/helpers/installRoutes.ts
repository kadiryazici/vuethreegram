import { Http } from '@/types';
import { FastifyServer } from '..';

const { default: routes, filenames }: Http.InstallGlob = await import(
   // @ts-ignore
   '../api/**/*'
);

export function defineRoutes(server: FastifyServer) {
   for (const [index, route] of routes.entries()) {
      // ../api/login.ts
      // ../api/something/bruh.ts
      let path = filenames[index];
      path = path.slice(2).split('.')[0];

      route.install(server, path);
   }
}
