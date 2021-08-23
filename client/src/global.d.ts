export type Int = string;
declare global {
   interface SubmitEvent extends Event {
      submitter: HTMLElement;
   }
}
