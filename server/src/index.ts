import '@/init';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';

import { join } from 'path';
import { DefaultPort } from '@/constants';
import { dirName } from '@/helpers';

const server = fastify({ logger: true });

server.register(fastifyStatic, {
   root: join(process.cwd(), 'prod/public'),
   prefix: '/asset/'
});

try {
   await server.listen(process.env.PORT || DefaultPort);
} catch (error) {
   server.log.error(error);
   process.exit(1);
}
