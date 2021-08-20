import { KoaServer } from './types';

declare module '*.path.ts' {
   export const setRoute: KoaServer.setRoute;
}
