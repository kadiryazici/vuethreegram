export type Int = number;
import { Request, Response } from 'express';

declare module 'vite-ssr' {
   interface SharedContext {
      request: Request;
      response: Response;
   }
}
