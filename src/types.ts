import { Server } from '.';
import { Constant } from './constants';

declare global {
   namespace NodeJS {
      export interface ProcessEnv {
         JWT_SECRET: string;
         JWT_REFRESH_SECRET: string;
         PORT: number;
         DATABASE_URL: string;
         MODE: 'prod' | 'dev';
      }
   }

   namespace Express {
      export interface Request {
         createCSRFToken: () => string;
         userID?: string;
      }
   }
}

export namespace ExpressServer {
   export type app = Server;

   export type SetRoute = (app: Server, path: string) => Promise<void>;
   export type PathFile = {
      setRoute: SetRoute;
   };
}

export namespace Api {
   export interface UserPayload {
      username: string;
      password: string;
   }
   export interface CookiePayload {
      [Constant.cookies.jwtName]: string;
      [Constant.cookies.refreshTokenName]: string;
      [key: string]: string;
   }
   export interface JWTBody {
      id: string;
   }
   export interface CreatePostResponseBody {
      postID: string;
   }
   export interface CreatePostRequestBody {
      content: string;
   }
   export interface MongoResponse {
      createdAt: string;
      updatedAt: string;
      _id: string;
   }
   export interface UserResponse extends MongoResponse {
      _id: string;
      username: string;
   }
   export interface PostResponse extends MongoResponse {
      postedBy: UserResponse;
      image: string;
      content: string;
   }
}
