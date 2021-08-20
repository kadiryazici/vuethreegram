import App from '/src/App.vue';

import 'virtual:windi.css';

import { viteSSR } from 'vite-ssr/vue';
import routes from 'virtual:generated-pages';

import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

export default viteSSR(App, { routes }, ({ app, request, response }) => {
   const head = createHead();
   const pinia = createPinia();

   if (import.meta.env.SSR && response) {
      response.setHeader('Set-Cookie', 'bruh=ahmet');
   }

   app.use(head).use(pinia);

   return {
      head
   };
});
