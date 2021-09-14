<script lang="ts">
export default {
   name: 'Page'
};
</script>

<script lang="ts" setup>
interface Props {
   maxWidth?: number;
}

const props = defineProps<Props>();
const propCustomWidth = $computed(() => {
   if (!props.maxWidth || typeof props.maxWidth !== 'number') return null;
   return `--page-max-width: ${props.maxWidth}px`;
});
</script>

<template>
   <div :style="[propCustomWidth]" class="page">
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
