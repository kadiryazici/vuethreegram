import { Api } from '@/types';
import fastifyCors from 'fastify-cors';

export const name = 'FastifyCors';

export const install: Api.install = async (server) => {
   server.register(fastifyCors, {});
};
