import { Http } from '@/types';

export const install: Http.install = (server, path) => {
   server.get('/bruh', (request, reply) => {
      reply.status(200).send(path);
   });
};
