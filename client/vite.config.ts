import { defineConfig } from 'vite';
import Windi from 'vite-plugin-windicss';
import Pages from 'vite-plugin-pages';
import Vue from '@vitejs/plugin-vue';
import VueJSX from '@vitejs/plugin-vue-jsx';
import SSR from 'vite-ssr/plugin';
import ViteIcons from 'vite-plugin-icons';

export default defineConfig({
   build: {
      target: 'es2020'
   },
   plugins: [
      Windi(),
      Pages({
         pagesDir: './src/pages'
      }),
      Vue(),
      VueJSX(),
      SSR({}),
      ViteIcons()
   ]
});
