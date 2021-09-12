export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
   if (chunkSize <= 0) throw new Error('chunk size should be bigger than 0');

   const tempArray = [];
   for (let i = 0; i < arr.length; i += chunkSize) {
      tempArray.push(arr.slice(i, i + chunkSize));
   }
   return tempArray;
}
