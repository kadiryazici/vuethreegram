import '@/init';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';

import { join } from 'path';
import { DefaultPort } from '@/constants';
import { defineRoutes } from './helpers/installRoutes';

const server = fastify({ logger: true });

server.register(fastifyStatic, {
   root: join(process.cwd(), 'prod/public'),
   prefix: '/public/'
});

defineRoutes(server);

try {
   await server.listen(process.env.PORT || DefaultPort);
} catch (error) {
   server.log.error(error);
   process.exit(1);
}

export type FastifyServer = typeof server;
