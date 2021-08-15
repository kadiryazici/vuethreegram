import { PostSchema } from './login.schema';
import { createJWT, verifyJWT } from '@/helpers/jwt';
import { Api } from '@/types';
import { FastifyRequest, FastifyReply } from 'fastify';
import { nanoid } from 'nanoid';

const Post = async (req: FastifyRequest, res: FastifyReply) => {
   const token = (
      req.body as {
         token: string;
      }
   ).token;

   const payload = await verifyJWT<{ id: string }>(
      token,
      process.env.JWT_SECRET
   );
   res.send(payload);
};

export const use: Api.use = async (server, path) => {
   server.post(path, { schema: PostSchema }, Post);
};
