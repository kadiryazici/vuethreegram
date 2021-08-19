import fastifyStatic from 'fastify-static';
import { join } from 'path';
import { Api } from '@/types';

export const name = 'FastifyStatic';

export const install: Api.install = async (server) => {
   await server.register(fastifyStatic, {
      root: join(process.cwd(), `static/${process.env.MODE}/public`),
      prefix: '/public/',
      decorateReply: false
   });
   await server.register(fastifyStatic, {
      root: join(process.cwd(), `clientfiles/public/assets`),
      prefix: '/assets/',
      decorateReply: false
   });
};
