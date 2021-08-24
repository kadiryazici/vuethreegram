import { viteSSR } from 'vite-ssr/vue';
import routes from 'virtual:generated-pages';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

import App from '/src/App.vue';
import 'virtual:windi.css';

export default viteSSR(
   App,
   { routes, pageProps: { passToPage: false } },
   async ({ app, request, response, initialState }) => {
      const head = createHead();
      const pinia = createPinia();
      if (import.meta.env.SSR) {
         // @ts-ignore
         initialState.csrf = request.createCSRFToken?.();
      }
      app.use(head).use(pinia);

      return {
         head
      };
   }
);
