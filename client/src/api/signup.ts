import { Api } from '$types';
import { ApiPath } from './consts';
import { MakeFetchError } from '/src/api/uploadPost';
import { makeFetch } from '/src/helpers/makeFetch';
import { useMainStore } from '/src/stores/mainStore';

export async function signup(username: string, password: string) {
   const mainStore = useMainStore();

   const headers = new Headers();
   headers.append('Content-Type', 'application/json');
   headers.append('X-CSRF-Token', mainStore.csrfToken);

   const [data, isError, response] = await makeFetch<Api.NoDataResponse>(ApiPath('/api/signup'), {
      headers,
      credentials: 'same-origin',
      body: JSON.stringify({ username, password })
   });

   if (isError) {
      throw {
         data,
         response
      } as MakeFetchError<typeof data>;
   }

   return data;
}
