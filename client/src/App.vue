<script lang="ts" setup>
import axios from 'axios';
import { RouterView } from 'vue-router';
import Navbar from '/src/components/Navbar.vue';

function login() {
   axios.post(
      'http://localhost:3000/api/login',
      {
         username: 'kadir',
         password: '222222'
      },
      {
         withCredentials: true
      }
   );
}

function checkUser() {
   axios.get('http://localhost:3000/user', {
      withCredentials: true
   });
}
</script>

<template>
   <Navbar />
   <button @click="login">Giriş</button>
   --
   <button @click="checkUser">Kontrol</button>
   <RouterView v-slot="{ Component }">
      <Suspense>
         <Component :is="Component" />
      </Suspense>
   </RouterView>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap');
* {
   font-family: 'Lexend Deca', sans-serif !important;
}
#app {
   @apply pt-60px bg-light-300 min-h-100vh px-3;
}
</style>
