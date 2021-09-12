<script lang="ts" setup>
import Page from '$comp/Page/index.vue';
import { getPosts } from '/src/api/getPosts';
import Post from '$comp/Post/index.vue';
import { onBeforeMount } from 'vue';
import { Api } from '$types';
import { ClientOnly } from 'vite-ssr/vue';

let isError = $ref(false);
let isLoading = $ref(true);
const posts = await getPosts().catch(() => {
   isError = true;
});
</script>
<template>
   <Page>
      <ClientOnly>
         <div v-if="isError">
            Bir hata oldu
            <span @click="" class="text-violet-700 underline cursor-pointer" role="button">Tekrar Deneyin</span>
         </div>
         <div v-else-if="!posts">Yüklenmece...</div>
         <Post v-else-if="Array.isArray(posts)" v-for="post of posts" :data="post" :key="post._id" />
      </ClientOnly>
   </Page>
</template>

<style lang="scss" scoped></style>
