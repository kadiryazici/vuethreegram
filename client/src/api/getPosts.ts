import { Api } from '$types';
import { ApiPath } from '/src/api/consts';
import { useAsyncData } from '/src/helpers/useAsyncData';
import { useMainStore } from '/src/stores/mainStore';

export const getPosts = () => {
   const mainStore = useMainStore();
   return useAsyncData<Api.PostResponse[]>('mainPagePosts', ApiPath('/api/posts'), {
      fetchConfig: {
         headers: {
            'X-CSRF-Token': mainStore.csrfToken
         },
         credentials: 'same-origin'
      }
   });
};
