<script lang="ts">
export default {
   name: 'Post'
};
</script>

<script lang="ts" setup>
import { Api } from '$types';
import OptionsIcon from 'virtual:vite-icons/icon-park-outline/more';

interface Props {
   data: Api.PostResponse;
}
const props = defineProps<Props>();
console.log(props);
</script>

<template>
   <div class="post">
      <div class="post-head">
         <span class="post-username">{{ data.postedBy.username }}</span>
         <span class="post-date">{{ new Date(data.createdAt).toLocaleTimeString() }}</span>
         <OptionsIcon class="post-icon" />
      </div>
      <div class="post-img">
         <img :src="data.image" />
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
         @apply text-size-12px mr-2 text-gray-400;
      }
      .post-icon {
         @apply text-size-30px  
            text-gray-600 cursor-pointer 
            transition-colors
            hover:(text-violet-700 bg-light-600)
            rounded-full;
      }
   }
   &-img {
   }

   &-footer {
      @apply min-h-50px py-4 px-4 text-size-14px flex items-center whitespace-pre-line;
      line-height: 16px;
   }
}
</style>
