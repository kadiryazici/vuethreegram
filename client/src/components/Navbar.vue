<script lang="ts" setup>
import IconInstagram from 'virtual:vite-icons/icon-park-outline/instagram';
import IconCamera from 'virtual:vite-icons/icon-park-outline/camera';
import IconMSG from 'virtual:vite-icons/icon-park-outline/message';

import { RouterLink } from 'vue-router';
</script>

<template>
   <div id="navbar">
      <RouterLink to="/upload/image" class="icon"><IconCamera /></RouterLink>
      <RouterLink to="/" class="logo"><IconInstagram /> Instagram</RouterLink>
      <RouterLink to="/" class="icon"><IconMSG /></RouterLink>
   </div>
</template>

<style lang="scss" scoped>
#navbar {
   @apply bg-opacity-30 backdrop-filter backdrop-blur-10px backdrop-saturate-180 bg-white shadow fixed left-0 top-0 w-full flex items-center justify-between box-border px-4 py-2 h-50px;
   .logo {
      @apply inline-flex text-size-18px hover:opacity-50 gap-1 items-center;
   }
   .icon {
      @apply text-siz-25px hover:opacity-50;
   }
}
</style>
