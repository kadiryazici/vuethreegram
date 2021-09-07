export function deepFreeze<T extends Record<string, any>>(o: T): T {
   Object.freeze(o);
   if (o === undefined) {
      return o;
   }

   Object.getOwnPropertyNames(o).forEach(function (prop) {
      if (
         o[prop] !== null &&
         (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
         !Object.isFrozen(o[prop])
      ) {
         deepFreeze(o[prop]);
      }
   });

   return o;
}
