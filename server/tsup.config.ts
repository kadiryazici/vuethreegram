import { defineConfig } from 'tsup';
import EsbuildGlobPlugin from 'esbuild-plugin-import-glob';
import { esbuildDecorators } from '@anatine/esbuild-decorators';

export const tsup = defineConfig({
   format: ['esm'],
   target: 'node16',
   clean: true,
   esbuildPlugins: [EsbuildGlobPlugin()],
   splitting: true,
   external: ['class-validator', 'reflect-metadata']
});
