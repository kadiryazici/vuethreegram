import { defineConfig } from 'tsup';
export const tsup = defineConfig({
   format: ['esm'],
   target: 'node16',
   splitting: true
});
