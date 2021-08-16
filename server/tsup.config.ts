import { defineConfig } from 'tsup';
import EsbuildGlobPlugin from 'esbuild-plugin-import-glob';

export const tsup = defineConfig({
   format: ['esm'],
   target: 'node16',
   clean: true,
   esbuildPlugins: [EsbuildGlobPlugin()],
   splitting: true
});
