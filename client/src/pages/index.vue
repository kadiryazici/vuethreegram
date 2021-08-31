<script lang="ts" setup>
import Page from '$comp/Page/index.vue';
import { getPosts } from '/src/api/getPosts';
import Post from '$comp/Post/index.vue';

const posts = await getPosts();
</script>
<template>
   <Page>
      <div v-if="!posts">Yükleniyor...</div>
      <template v-else>
         <Post v-for="post in posts" :data="post" :key="post._id" />
      </template>
   </Page>
</template>

<style lang="scss" scoped></style>
