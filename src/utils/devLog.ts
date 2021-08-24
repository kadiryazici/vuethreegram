import { prettyLog } from './prettyLog';

/**
 * Logs given message only in `DEV` mode
 */
export function devLog(msg: string) {
   if (process.env.MODE === 'dev') {
      prettyLog('DEVLOG', msg);
   }
}
