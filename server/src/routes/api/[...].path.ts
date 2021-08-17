import { Api } from '@/types';

export const use: Api.use = async (server, path) => {
   server.get(path, async () => {
      return 'this is api endpoint';
   });
};
