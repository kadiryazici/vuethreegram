<script lang="ts" setup>
function login() {
   const headers = new Headers();
   headers.set('Content-Type', 'application/json');

   fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers,
      body: JSON.stringify({
         username: 'kadir',
         password: '222222'
      }),
      credentials: 'same-origin'
   });
}
</script>
<template>
   <div>
      <h2 class="text-violet-800">Burası ana Sayfadır</h2>
      <button class="purple-button" @click="login">Giriş Yap</button>
   </div>
</template>
