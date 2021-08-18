<script lang="ts" setup>
import { RouterView } from 'vue-router';
</script>

<template>
   <RouterView v-slot="{ Component }">
      <Suspense>
         <Component :is="Component" />
      </Suspense>
   </RouterView>
</template>
