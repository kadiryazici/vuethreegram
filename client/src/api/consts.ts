export const PORT = () => {
   if (import.meta.env.SSR) {
      return process.env['PORT'];
   }
   return 3000;
};
export const ApiHostname = `http://localhost:` + PORT();

export function ApiPath(pathname: string) {
   return `${ApiHostname}${pathname}`;
}
