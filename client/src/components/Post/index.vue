<script lang="ts">
export default {
   name: 'Post'
};
</script>

<script lang="ts" setup>
import { Api } from '$types';
import OptionsIcon from 'virtual:vite-icons/icon-park-outline/more';
import { RouterLink } from 'vue-router';

interface Props {
   data: Api.PostResponse;
}
const props = defineProps<Props>();
</script>

<template>
   <div class="post">
      <div class="post-head">
         <RouterLink :to="`/profile/${data.postedBy.username}`" class="post-username">{{
            data.postedBy.username
         }}</RouterLink>
         <RouterLink :to="`/post/${data._id}`" class="post-date">{{
            new Date(data.createdAt).toLocaleTimeString()
         }}</RouterLink>
         <OptionsIcon class="post-icon" />
      </div>
      <div class="post-img-wrapper">
         <img class="post-img" :src="data.image" />
      </div>
      <div class="post-footer">{{ data.content }}</div>
   </div>
</template>

<style lang="scss" scoped>
.post {
   @apply bg-white rounded-md mb-5 shadow shadow-gray-500;

   &-head {
      @apply px-4 py-2 flex items-center;

      .post-username {
         @apply mr-auto text-size-13px font-bold cursor-pointer hover:(underline);
      }
      .post-date {
         @apply text-size-12px mr-2 text-gray-400 hover:(underline);
      }
      .post-icon {
         @apply text-size-30px  
            text-gray-600 cursor-pointer 
            transition-colors
            hover:(text-violet-700 bg-light-600)
            rounded-full;
      }
   }

   &-img-wrapper {
      .post-img {
         @apply mx-auto w-full;
      }
   }

   &-footer {
      @apply min-h-50px py-4 px-4 text-size-14px flex items-center whitespace-pre-line;
      line-height: 16px;
   }
}
</style>
