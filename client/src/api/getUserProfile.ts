import { Api } from '$types';
import { ApiPath } from '/src/api/consts';
import { useAsyncData } from '/src/helpers/useAsyncData';
import { useMainStore } from '/src/stores/mainStore';

export const getUserProfile = (username: string, page = 1) => {
   const mainStore = useMainStore();
   return useAsyncData<Api.ProfileResponse>('userProfileData', ApiPath(`/api/user/${username}`), {
      fetchConfig: {
         headers: {
            'X-CSRF-Token': mainStore.csrfToken
         },
         credentials: 'same-origin'
      }
   });
};
