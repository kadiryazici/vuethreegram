<script lang="ts" setup>
import { RouterView } from 'vue-router';
import Navbar from '/src/components/Navbar.vue';
</script>

<template>
   <Navbar />
   <RouterView v-slot="{ Component }">
      <Suspense>
         <Component :is="Component" />
      </Suspense>
   </RouterView>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap');

:root {
   --page-max-width: 600px;
}

* {
   font-family: 'Lexend Deca', sans-serif !important;
}
body {
   @apply bg-light-700;
}
#app {
   @apply py-75px min-h-100vh px-3;
   overscroll-behavior: none;
}
</style>
