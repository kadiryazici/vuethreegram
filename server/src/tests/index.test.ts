import fetch from 'node-fetch';
import tap from 'tap';
import { FastifyServer } from '@/index';
import { createCSRFToken } from '@/guards/csrfGuard';

type Body = Record<string, any>;

let timeout = null as ReturnType<typeof setTimeout> | null;
const closeServer = (server: FastifyServer) => {
   if (timeout) {
      clearTimeout(timeout);
   }
   timeout = setTimeout(() => {
      server.close();
   }, 2000);
};

export function runTests(server: FastifyServer) {
   tap.afterEach(() => {
      closeServer(server);
   });

   tap.test('GET `/api/` route', (t) => {
      t.plan(2);
      server.inject(
         {
            method: 'GET',
            url: '/api/test/csrf',
            headers: {
               'x-csrf-token': createCSRFToken()
            }
         },
         (err, response) => {
            t.error(err);
            t.equal(response.statusCode, 200);
         }
      );
   });
}
