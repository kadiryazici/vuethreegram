import { serializeUsername } from '@/helpers/user';
import { Api } from '@/types';
import { FastifyRequest, FastifyReply, FastifySchema } from 'fastify';
import bcrypt from 'bcrypt';

export interface SignupBody {
   username: string;
   password: string;
}

const PostSchema: FastifySchema = {
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

async function Post(req: FastifyRequest, res: FastifyReply) {
   let { password, username } = req.body as SignupBody;
   username = serializeUsername(username);
   if (username.length < 3 && username.length > 20)
      throw new Error('username length is not correct');
}

export const use: Api.use = async (server, path) => {
   server.post(path, { schema: PostSchema }, Post);
};
