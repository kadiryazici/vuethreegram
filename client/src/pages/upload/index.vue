<script lang="ts" setup>
import axios from 'axios';
async function onSubmit(e: Event) {
   if (e.target && e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target);
      await axios({
         url: 'http://localhost:4000/api/upload/post',
         method: 'POST',
         data: formData,
         withCredentials: true
      });
   }
}
</script>

<template>
   <form @submit.prevent="onSubmit">
      <input
         type="file"
         name="image"
         accept="image/png, image/gif, image/jpeg"
         required
      />
      <input name="content" type="text" required min="5" max="280" />
      <input name="image" type="submit" value="Gönder" />
   </form>
</template>
