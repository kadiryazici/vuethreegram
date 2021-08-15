import { FastifySchema } from 'fastify';

export const LoginSchema: FastifySchema = {
   body: {
      type: 'object',
      properties: {
         username: {
            type: 'string',
            minLength: 3,
            maxLength: 20
         },
         password: {
            type: 'string',
            minLength: 6,
            maxLength: 20
         }
      },
      required: ['username', 'password']
   }
};
