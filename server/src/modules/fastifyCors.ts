import { Api } from '@/types';
import fastifyCors from 'fastify-cors';

export const name = 'FastifyCors';

export const install: Api.install = async (server) => {
   await server.register(fastifyCors, {
      origin: [
         'http://localhost:3000',
         'http://localhost:4000',
         'http://127.0.0.1:3000',
         'http://127.0.0.1:4000'
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders:
         'X-CSRF-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
      credentials: true
   });
};
