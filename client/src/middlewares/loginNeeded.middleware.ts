import { defineMiddleware } from 'vite-ssr-middleware';

export default defineMiddleware('loginNeeded', (context, properties) => {
   return true;
});
