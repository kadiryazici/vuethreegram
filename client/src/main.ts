import { viteSSR } from 'vite-ssr/vue';
import routes from 'virtual:generated-pages';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

import App from './App.vue';
import 'virtual:windi.css';

const routerOptions: Parameters<typeof viteSSR>['1']['routerOptions'] = {
   scrollBehavior(to, from, savedPosition) {
      return savedPosition || { top: 0 };
   }
};

export default viteSSR(
   App,
   { routes, pageProps: { passToPage: false }, routerOptions },
   async ({ app, request, response, initialState }) => {
      const head = createHead();
      const pinia = createPinia();
      if (import.meta.env.SSR) {
         // @ts-ignore
         initialState.csrf = request.createCSRFToken?.();
      }

      // only for dev
      if (!import.meta.env.SSR) {
         // @ts-ignore
         window.login = function login() {
            const headers = new Headers();
            headers.set('Content-Type', 'application/json');

            fetch('http://localhost:3000/api/login', {
               method: 'POST',
               headers,
               body: JSON.stringify({
                  username: 'vierone',
                  password: '123456'
               }),
               credentials: 'same-origin'
            });
         };
      }

      app.use(head).use(pinia);

      return {
         head
      };
   }
);
