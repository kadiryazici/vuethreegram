import Csrf from 'csrf';
import { FastifyRequest } from 'fastify';
import httpErrors from 'http-errors';

const throwFN = () => new httpErrors.BadRequest('invalid csrf token');

const tokens = new Csrf();
const secret = tokens.secretSync();

export async function useCsrfGuard(req: FastifyRequest) {
   const token = req.headers['x-csrf-token'];
   if (typeof token !== 'string') {
      throw throwFN();
   }

   const isValid = tokens.verify(secret, token);
   if (!isValid) {
      throw throwFN();
   }
   return true;
}

export function createCSRFToken() {
   return tokens.create(secret);
}
