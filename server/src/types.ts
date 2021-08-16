import { FastifyServer } from '.';

declare global {
   namespace NodeJS {
      interface ProcessEnv {
         JWT_SECRET: string;
         JWT_REFRESH_SECRET: string;
         PORT: number;
         MODE: 'prod' | 'dev';
      }
   }
}

export namespace App {
   export interface Post {
      id: string;
      image: string;
      /**
       * as miliseconds
       */
      createDate: number;
   }

   export interface User {
      id: string;
      password: string;
      createdAt: number;
      username: string;
      posts: Post[];
   }

   export interface UserPayload {
      id: User['id'];
   }

   export interface Database {
      posts: Post[];
      users: User[];
      refreshTokens: string[];
   }
}

export namespace Api {
   export type use = (server: FastifyServer, path: string) => Promise<any>;
   export interface InstallGlob {
      default: { use?: Api.use }[];
      filenames: string[];
   }

   export type install = (server: FastifyServer) => Promise<any>;
   export interface ModuleGlob {
      default: { install?: Api.install; name: string }[];
      filenames: string[];
   }

   export interface AuthBody {
      username: string;
      password: string;
   }
}
