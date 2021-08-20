import Koa from 'koa';
declare global {
   interface SubmitEvent extends Event {
      submitter: HTMLElement;
   }
}
