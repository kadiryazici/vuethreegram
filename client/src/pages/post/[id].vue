<script lang="ts" setup>
import Page from '$comp/Page/index.vue';
</script>

<template>
   <Page :maxWidth="950" class="_page">
      <div class="_page-wrapper">
         <div class="_img-section">
            <img class="_img" src="http://localhost:3000/postimg/grsbbg-6xiIDEpLygwO6R.jpg" />
         </div>
         <div class="_comments-section"></div>
      </div>
   </Page>
</template>

<style lang="scss" scoped>
._page {
   @apply bg-white rounded-md shadow transform overflow-hidden;
   ._page-wrapper {
      @apply w-full h-[var(--pageWrapperHeight)] flex flex-nowrap;
      --maxImgSectionWidth: 575px;
      --pageWrapperHeight: 550px;
      ._img-section {
         @apply w-full max-w-[var(--maxImgSectionWidth)] 
               h-full bg-black flex 
               flex-nowrap items-center justify-center;
         ._img {
            @apply max-w-full max-h-full;
         }
      }
      ._comments-section {
      }
   }
}
</style>
