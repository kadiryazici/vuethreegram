import { Request, Response } from 'express';
import { Pinia, StateTree } from 'pinia';

declare module 'vite-ssr/vue/types' {
   export interface Context {
      request: Request;
      response: Response;
      initialState: {
         pinia: Record<string, StateTree>;
         csrf: string;
         [key: string]: any;
      };
   }
}

declare module 'vite-ssr-middleware' {
   interface CustomProperties {
      pinia: Pinia;
   }
}

declare module '*.vue' {
   import { DefineComponent } from 'vue';
   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
   const component: DefineComponent<{}, {}, any>;
   export default component;
}
