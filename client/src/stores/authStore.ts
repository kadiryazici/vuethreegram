import { Api } from '$types';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authStore', {
   state: () => ({
      isLogged: false,
      userInfo: null as null | Api.LoginResponse
   })
});
