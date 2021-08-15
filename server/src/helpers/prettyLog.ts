import chalk from 'chalk';

export function prettyLog(head: string, body: string) {
   head = chalk.magentaBright('[' + head + ']');
   body = chalk.cyan(body);
   console.log(`${head} ${body}`);
}
