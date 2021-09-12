<script lang="ts" setup>
import Input from '$comp/Input/index.vue';
import { RouterLink, useRouter } from 'vue-router';
import { login } from '/src/api/login';
import { MakeFetchError } from '/src/api/uploadPost';
import { Api } from '$types';
import { useAuthStore } from '/src/stores/authStore';
import { signup } from '/src/api/signup';

interface Props {
   type: 'login' | 'signup';
}

const props = defineProps<Props>();
const authStore = useAuthStore();
const router = useRouter();

let username = $ref('');
let password = $ref('');

function submitForm() {
   if (props.type === 'login') {
      postLogin();
   } else {
      postSignup();
   }
}

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
async function postSignup() {
   try {
      await signup(username, password);
      router.push('/login');
   } catch (_) {
      const error = _ as MakeFetchError<Api.NoDataResponse>;
      console.log(error);
      console.error(error.data);
   }
}
</script>

<template>
   <form @submit.prevent="submitForm">
      <h3 class="page-title">{{ props.type === 'login' ? 'Login' : 'Signup' }}</h3>
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
         <RouterLink :to="props.type === 'login' ? '/signup' : '/login'" class="link">No account? Sign up.</RouterLink>
      </div>
      <button class="purple-button">Send</button>
   </form>
</template>

<style lang="scss" scoped>
._input-section {
   @apply mb-5;

   ._title {
      @apply w-full inline-block text-left;
   }

   > * {
      @apply w-full max-w-500px;
   }
}
</style>
