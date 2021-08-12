import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import SSR from 'vite-ssr/plugin';
import WindiCSS from 'vite-plugin-windicss';
import VueJSX from '@vitejs/plugin-vue-jsx';
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      Vue(),
      SSR(),
      WindiCSS(),
      VueJSX(),
      Pages({ pagesDir: 'src/pages' })
   ]
});
