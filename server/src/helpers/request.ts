import { FastifyReply } from 'fastify';

const Success = (reply: FastifyReply) => {
   reply.statusCode = 200;
};
