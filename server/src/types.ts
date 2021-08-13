import { FastifyServer } from '.';

declare global {
   namespace NodeJS {
      interface ProcessEnv {
         JWT_SECRET: string;
         JWT_REFRESH_SECRET: string;
         PORT: number;
      }
   }
}

export namespace App {
   interface Post {
      id: string;
   }

   interface User {
      id: string;
      password: string;
      createdAt: number;
      posts: Post[];
   }

   export interface Database {
      posts: Post[];
      users: User[];
   }
}

export namespace Http {
   export type install = (server: FastifyServer, path: string) => any;
   export interface InstallGlob {
      default: { install: Http.install }[];
      filenames: string[];
   }
}
