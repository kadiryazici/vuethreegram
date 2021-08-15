import { serializeUsername } from '@/helpers/user';
import { Api } from '@/types';
import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { PostSchema } from './signup.schema';
import { validateAuthBody } from '@/validators/validateAuthBody';

async function Post(req: FastifyRequest, res: FastifyReply) {
   const user = await validateAuthBody(req.body as Api.AuthBody);
   return user;
}

export const use: Api.use = async (server, path) => {
   server.post(path, { schema: PostSchema }, Post);
};
