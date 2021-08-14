import chalk from 'chalk';

export function installLog(head: string) {
   const $head = chalk.magenta(head);
   const $body = chalk.cyan('module has been installed.');
   const text = chalk.whiteBright(`[${$head}] ${$body}`);
   console.log(text);
}
