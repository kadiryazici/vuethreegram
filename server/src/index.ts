import 'reflect-metadata';
import '@/init';
import fastify from 'fastify';
import { DefaultPort } from '@/constants';
import { useRoutes } from '@/helpers/useRoutes';
import { installModules } from '@/helpers/installModules';
import { prettyLog } from '@/helpers/prettyLog';

const server = fastify({
   logger:
      process.env.MODE === 'test'
         ? false
         : {
              level: 'info',
              prettyPrint: {
                 translateTime: 'dd.mm.yyyy hh:mm',
                 ignore: 'pid,hostname,reqId,responseTime,req,res',
                 messageFormat: '{msg} [id={reqId} {req.method} {req.url}]'
              }
           }
});

await installModules(server);
await useRoutes(server);

try {
   const port = process.env.PORT || DefaultPort;
   await server.listen(port);
   prettyLog(process.env.MODE.toUpperCase(), `Server is up on port ${port}.`);
} catch (error) {
   server.log.error(error);
   process.exit(1);
}

export type FastifyServer = typeof server;
