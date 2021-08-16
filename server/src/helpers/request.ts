import { FastifyReply } from 'fastify';

export const Success = (message = 'successful') => {
   return {
      message
   } as const;
};
