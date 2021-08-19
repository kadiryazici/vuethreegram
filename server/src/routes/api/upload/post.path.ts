import { useDB } from '@/db';
import { useAuthGuard } from '@/guards/authGuard';
import { useCsrfGuard } from '@/guards/csrfGuard';
import { getTimeWithoutTimezone } from '@/helpers/utility';
import { upload } from '@/prehandlers/multer';
import { Api, App } from '@/types';
import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs-extra';
import { nanoid } from 'nanoid';
import path from 'node:path';

async function Post(request: FastifyRequest, reply: FastifyReply) {
   // await useCsrfGuard(request);
   const { username } = await useAuthGuard(request);

   const file = request.files.image[0];
   const extension = file.mimetype.split('/')[1];
   const fileName = nanoid() + `.${extension}`;
   const destination = path.join(
      process.cwd(),
      `static/${process.env.MODE}/public/${fileName}`
   );
   const content = (request.body as Record<string, any>).content as string;
   await fs.writeFile(destination, file.buffer);

   const db = useDB();
   if (db.data) {
      const postData: App.Post = {
         content,
         createDate: getTimeWithoutTimezone(new Date()),
         id: nanoid(),
         image: `http://localhost:4000/public/${fileName}`,
         username
      };
      db.data.posts.push(postData);

      const userIndex = db.data.users.findIndex(
         (user) => user.username === username
      );
      db.data.users[userIndex].posts.push(postData.id);
      await db.write();
   }

   return 'tamamdir';
}

export const use: Api.use = async (server, path) => {
   server.post(
      path,
      {
         preHandler: upload.fields([
            {
               name: 'image',
               maxCount: 1
            }
         ])
      },
      Post
   );
};
