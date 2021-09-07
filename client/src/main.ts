import { viteSSR, useContext, Context } from 'vite-ssr/vue';
import routes from 'virtual:generated-pages';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { middlewareHandler } from 'vite-ssr-middleware';

import App from './App.vue';
import 'virtual:windi.css';
import { useAuthStore } from '/src/stores/authStore';
import { useMainStore } from '/src/stores/mainStore';
import { Api } from '$types';

const viteSSROptions: Parameters<typeof viteSSR>['1'] = {
   routes,
   pageProps: { passToPage: false },
   routerOptions: {
      scrollBehavior(to, from, savedPosition) {
         return savedPosition || { top: 0 };
      }
   }
};

export default viteSSR(App, viteSSROptions, async ({ app, request, response, initialState, router }) => {
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

   app.use(head).use(pinia);

   return { head };
});
