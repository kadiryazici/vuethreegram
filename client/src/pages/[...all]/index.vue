<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
onMounted(() => {
   setTimeout(() => {
      router.push('/');
   }, 2000);
});
</script>

<template>
   <h2 class="text-size-20px">Kardeşim Böyle Bir Yer Yok Ana Sayfaya Yönlendiriliyorsun</h2>
</template>
