import { Api } from '@/types';
import { multer } from '@/prehandlers/multer';
export const name = 'FastifyMulter';

export const install: Api.install = async (server) => {
   await server.register(multer.contentParser);
};
