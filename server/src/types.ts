import { FastifyServer } from '.';
import { JWTConfig } from '@/constants';

declare global {
   namespace NodeJS {
      interface ProcessEnv {
         JWT_SECRET: string;
         JWT_REFRESH_SECRET: string;
         PORT: number;
         MODE: 'prod' | 'dev' | 'test';
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

   export interface Database {
      posts: Post[];
      users: User[];
      refreshTokens: string[];
   }
}

export namespace Api {
   export type use =
      | ((server: FastifyServer, path: string) => Promise<any>)
      | undefined;
   export interface InstallGlob {
      default: { use?: Api.use }[];
      filenames: string[];
   }
   export interface UserJWTPayload {
      id: App.User['id'];
   }

   export type install = ((server: FastifyServer) => Promise<any>) | undefined;
   export interface ModuleGlob {
      default: { install?: Api.install; name: string }[];
      filenames: string[];
   }

   export interface AuthBody {
      username: string;
      password: string;
   }

   export type TokenPayload = {
      [JWTConfig.refreshCookieName]?: string;
      [JWTConfig.jwtCookieName]: string;
   };
}
