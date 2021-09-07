import { Api } from '$types';
import { ApiPath } from '/src/api/consts';
import { makeFetch } from '/src/helpers/makeFetch';
import { useMainStore } from '/src/stores/mainStore';

export const getPosts = () => {
   const mainStore = useMainStore();
   return makeFetch<Api.PostResponse[]>(ApiPath('/api/posts'), {
      headers: {
         'X-CSRF-Token': mainStore.csrfToken
      },
      credentials: 'same-origin'
   });
};
