import { Api } from '$types';
import { ApiPath } from './consts';
import { MakeFetchError } from '/src/api/uploadPost';
import { makeFetch } from '/src/helpers/makeFetch';
import { useAuthStore } from '/src/stores/authStore';
import { useMainStore } from '/src/stores/mainStore';

export async function logout() {
   const mainStore = useMainStore();
   const authStore = useAuthStore();

   const headers = new Headers();
   headers.append('X-CSRF-Token', mainStore.csrfToken);

   const [data, isError, response] = await makeFetch<Api.LoginResponse>(ApiPath('/api/logout'), {
      method: 'POST',
      headers,
      credentials: 'same-origin'
   });

   if (isError) {
      throw {
         data,
         response
      } as MakeFetchError<typeof data>;
   }
   authStore.isLogged = false;
   authStore.userInfo = null;

   return data;
}
