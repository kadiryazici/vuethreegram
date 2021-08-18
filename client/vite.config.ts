import { defineConfig } from 'vite';
import Windi from 'vite-plugin-windicss';
import Pages from 'vite-plugin-pages';
import Vue from '@vitejs/plugin-vue';
import VueJSX from '@vitejs/plugin-vue-jsx';

export default defineConfig({
   plugins: [
      Windi(),
      Pages({
         pagesDir: 'src/pages'
      }),
      Vue(),
      VueJSX()
   ]
});
