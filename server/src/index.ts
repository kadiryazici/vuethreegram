import 'reflect-metadata';
import '@/init';
import fastify from 'fastify';
import chalk from 'chalk';
import { DefaultPort } from '@/constants';
import { useRoutes } from '@/helpers/installRoutes';
import { installModules } from '@/helpers/installModules';

const server = fastify({
   logger: {
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
   const text =
      chalk.magentaBright(`[${process.env.MODE.toUpperCase()}]`) +
      chalk.cyan(` Server is up on port ${port}.`);
   console.log(text);
} catch (error) {
   server.log.error(error);
   process.exit(1);
}

export type FastifyServer = typeof server;
