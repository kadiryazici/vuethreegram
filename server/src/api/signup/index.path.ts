import { serializeUsername } from '@/helpers/user';
import { Api } from '@/types';
import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { PostSchema } from '@/api/signup/schema';

export interface SignupBody {
   username: string;
   password: string;
}

async function Post(req: FastifyRequest, res: FastifyReply) {
   let { password, username } = req.body as SignupBody;
   username = serializeUsername(username);
   if (username.length < 3 && username.length > 20)
      throw new Error('username length is not correct');
}

export const use: Api.use = async (server, path) => {
   server.post(path, { schema: PostSchema }, Post);
};
