export function serializeUsername(uname: string) {
   uname = uname.replace(/  +/g, ' ');
   uname = uname.trim();
   return uname;
}
