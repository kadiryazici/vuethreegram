<script lang="ts">
export default {
   name: 'Page'
};
</script>

<template>
   <div class="page">
      <slot />
   </div>
</template>

<style lang="scss" scoped>
.page {
   @apply w-full
         max-w-[var(--page-max-width)]
         mx-auto;
}
</style>
