<script lang="ts">
export default {
   name: 'Navbar'
};
</script>

<script lang="ts" setup>
import IconInstagram from 'virtual:vite-icons/icon-park-outline/instagram';
import IconCamera from 'virtual:vite-icons/icon-park-outline/camera';
import IconMSG from 'virtual:vite-icons/icon-park-outline/message';
import IconMe from 'virtual:vite-icons/icon-park-outline/me';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '/src/stores/authStore';

const authStore = useAuthStore();

const profileIconTo = $computed(() => (authStore.isLogged ? `/profile/${authStore.userInfo!.username}` : '/login'));
</script>

<template>
   <div id="navbar">
      <RouterLink to="/upload" class="icon"><IconCamera /></RouterLink>
      <RouterLink to="/upload" class="invisible icon"><IconCamera /></RouterLink>
      <RouterLink to="/" class="logo"><IconInstagram />Vuegram</RouterLink>
      <RouterLink :to="profileIconTo" class="icon"><IconMe /></RouterLink>
      <RouterLink to="/" class="icon"><IconMSG /></RouterLink>
   </div>
</template>

<style lang="scss" scoped>
#navbar {
   @apply z-999 bg-opacity-70 backdrop-filter gap-x-3 backdrop-blur-10px backdrop-saturate-180 bg-white shadow fixed left-0 top-0 w-full flex items-center box-border px-4 py-2 h-50px;
   .logo {
      @apply inline-flex text-size-18px hover:opacity-50 items-center mx-auto;
   }
   .icon {
      @apply text-size-25px hover:opacity-50;
   }
}
</style>
