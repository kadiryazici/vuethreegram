import App from '/src/App.vue';

import 'virtual:windi.css';

import { useContext, viteSSR } from 'vite-ssr/vue';
import routes from 'virtual:generated-pages';

import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { Context } from 'vite-ssr/vue';

export default viteSSR(App, { routes }, ({ app, request, response, initialState }) => {
   const head = createHead();
   const pinia = createPinia();
   if (import.meta.env.SSR) {
      // @ts-ignore
      initialState.csrf = request!.csrfToken?.();
   }
   app.use(head).use(pinia);

   return {
      head
   };
});
