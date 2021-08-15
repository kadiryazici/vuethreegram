import { FastifySchema } from 'fastify';

export const PostSchema: FastifySchema = {
   body: {
      type: 'object',
      properties: {
         username: {
            type: 'string'
         },
         password: {
            type: 'string'
         }
      },
      required: ['username', 'password']
   }
};
