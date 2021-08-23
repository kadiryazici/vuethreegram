import { ExpressServer } from './types';

declare module '*.path.ts' {
   export const setRoute: ExpressServer.SetRoute;
}
