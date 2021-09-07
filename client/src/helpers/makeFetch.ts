type FetchOptions = Parameters<typeof fetch>['1'];

export async function makeFetch<T>(url: string, options?: FetchOptions): Promise<[T, boolean, Response]> {
   const response = await fetch(url, options);
   let isError = false;
   if (!response.ok) {
      isError = true;
   }
   const data = (await response.json()) as T;
   return [data, isError, response];
}
