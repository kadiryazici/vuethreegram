import { Server } from '.';

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
         csrfToken: () => string;
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
}
