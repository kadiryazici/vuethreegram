import 'virtual:windi.css';

import { Context, useContext, viteSSR } from 'vite-ssr/vue';
import { Middleware, middlewareHandler } from 'vite-ssr-middleware';

import { Api } from '$types';
import App from './App.vue';
import { createHead } from '@vueuse/head';
import { createPinia } from 'pinia';
import { isBrowser } from '/src/helpers/isBrowser';
import routes from 'virtual:generated-pages';
import { useAuthStore } from '/src/stores/authStore';
import { useMainStore } from '/src/stores/mainStore';

const middlewares: Middleware[] = Object.values(import.meta.globEager('/src/middlewares/*.middleware.ts')).map((v) => {
   return v.default as Middleware;
});

if (isBrowser()) {
   console.log({
      middlewares
   });
}

const viteSSROptions: Parameters<typeof viteSSR>['1'] = {
   routes,
   pageProps: { passToPage: false },
   routerOptions: {
      scrollBehavior(to, from, savedPosition) {
         return savedPosition || { top: 0 };
      }
   }
};

export default viteSSR(App, viteSSROptions, async (context) => {
   const { app, request, response, initialState, router } = context;
   const head = createHead();
   const pinia = createPinia();

   if (import.meta.env.SSR) {
      const authStore = useAuthStore(pinia);
      const mainStore = useMainStore(pinia);
      if (request.user) {
         authStore.isLogged = true;
         authStore.userInfo = request.user as Api.LoginResponse;
      }

      mainStore.csrfToken = request.createCSRFToken();
      initialState.pinia = pinia.state.value;
   } else {
      pinia.state.value = initialState.pinia;
   }

   router.beforeEach(middlewareHandler(context, middlewares));
   app.use(head).use(pinia);

   return { head };
});
