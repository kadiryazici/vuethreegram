import App from './App.vue';
import routes from 'virtual:generated-pages';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { viteSSR } from 'vite-ssr/vue';

import 'virtual:windi.css';

export default viteSSR(App, { routes }, ({ app }) => {
   const head = createHead();
   const pinia = createPinia();

   app.use(pinia).use(head);

   return {
      head
   };
});
