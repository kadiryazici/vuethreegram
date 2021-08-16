import { useCsrfGuard } from '@/guards/csrfGuard';
import { Api } from '@/types';

export const use: Api.use =
   process.env.MODE !== 'test'
      ? undefined
      : async (server, path) => {
           server.get(path, async (req, res) => {
              await useCsrfGuard(req);
              return 'csrf passed';
           });
        };
