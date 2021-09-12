import chalk from 'chalk';
import { prettyLog } from './prettyLog';

/**
 * Logs given message only in `DEV` mode
 */
export function devLog(msg: string) {
   if (process.env.MODE === 'dev') {
      prettyLog('DEVLOG', msg);
   }
}

export function devLogError(msg: string) {
   if (process.env.MODE === 'dev') {
      const coloredMessage = chalk.red.bgWhite(msg);
      console.log(coloredMessage);
   }
}
