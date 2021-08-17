import { Api, App } from '@/types';
import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { validateAuthBody } from '@/validators/validateAuthBody';
import { useDB } from '@/db';
import { doesUserExists } from '@/helpers/db';
import { getTimeWithoutTimezone } from '@/helpers/utility';
import { nanoid } from 'nanoid';
import { BcryptSalt } from '@/constants';
import httpErrors from 'http-errors';

async function Post(req: FastifyRequest, res: FastifyReply) {
   const body = await validateAuthBody(req.body as Api.AuthBody).catch(() => {
      throw new httpErrors.BadRequest('invalid request body');
   });

   const db = useDB();
   const user = await doesUserExists(body.username);
   if (user) throw new httpErrors.Conflict('user already exists');

   const passwordHash = await bcrypt
      .hash(body.password, BcryptSalt)
      .catch(() => {
         throw new httpErrors.InternalServerError(
            'an error occured while hashing password'
         );
      });

   const date = new Date();
   const userData: App.User = {
      createdAt: getTimeWithoutTimezone(date),
      id: nanoid(),
      posts: [],
      username: body.username,
      password: passwordHash
   };
   db.data?.users.push(userData);
   await db.write();

   return {
      message: 'user has been created'
   };
}

export const use: Api.use = async (server, path) => {
   server.post(path, Post);
};
