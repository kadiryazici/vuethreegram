export type Int = number;
import { Request, Response } from 'express';

declare module 'vite-ssr' {
   interface SharedContext {
      request: Request;
      response: Response;
   }
}

declare module '*.vue' {
   import { DefineComponent } from 'vue';
   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
   const component: DefineComponent<{}, {}, any>;
   export default component;
}
