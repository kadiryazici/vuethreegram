<script lang="ts" setup>
import Page from '$comp/Page/index.vue';
import { getPosts } from '/src/api/getPosts';
import Post from '$comp/Post/index.vue';
import { onBeforeMount } from 'vue';
import { Api } from '$types';
import { ClientOnly } from 'vite-ssr/vue';

let isError = $ref(false);
let isLoading = $ref(true);
let posts = $ref<Api.PostResponse[]>([]);
onBeforeMount(fetchPosts);

async function fetchPosts() {
   const [data, fetchError, response] = await getPosts();
   isLoading = false;
   if (fetchError) {
      if (data) {
         console.error(data);
      }
      isError = true;
      return;
   }
   if (Array.isArray(data)) {
      posts = data;
   }
}
</script>
<template>
   <Page>
      <ClientOnly>
         <div v-if="isError">
            Bir hata oldu
            <span @click="" class="text-violet-700 underline cursor-pointer" role="button">Tekrar Deneyin</span>
         </div>
         <div v-if="isLoading">Yüklenmece...</div>
         <Post v-for="post of posts" :data="post" :key="post._id" />
      </ClientOnly>
   </Page>
</template>

<style lang="scss" scoped></style>
