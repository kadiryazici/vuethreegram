<script lang="ts" setup>
import Page from '$comp/Page/index.vue';
import Input from '$comp/Input/index.vue';
import { RouterLink, useRouter } from 'vue-router';
import { login } from '/src/api/login';
import { MakeFetchError } from '/src/api/uploadPost';
import { Api } from '$types';
import { useAuthStore } from '/src/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

let username = $ref('');
let password = $ref('');

async function postLogin() {
   try {
      const res = await login(username, password);
      authStore.isLogged = true;
      authStore.userInfo = res;
      router.push('/');
   } catch (_) {
      const error = _ as MakeFetchError<Api.NoDataResponse>;
      console.log(error);
      console.error(error.data);
   }
}
</script>

<template>
   <Page class="_page">
      <h3 class="page-title">Login</h3>
      <div class="_input-section">
         <small class="_title">username</small>
         <br />
         <Input trim v-model="username" />
      </div>

      <div class="_input-section">
         <small class="_title">password</small>
         <br />
         <Input type="password" v-model="password" />
      </div>

      <div class="_input-section">
         <RouterLink to="/" class="link">No account? Sign up.</RouterLink>
      </div>
      <button @click="postLogin" class="purple-button">Send</button>
   </Page>
</template>

<style lang="scss" scoped>
._page {
   @apply p-6 bg-white text-center rounded-md;
   ._input-section {
      @apply mb-5;

      ._title {
         @apply w-full inline-block text-left;
      }

      > * {
         @apply w-full max-w-500px;
      }
   }
}
</style>
