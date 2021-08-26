<script lang="ts" setup>
import IconUpload from 'virtual:vite-icons/icon-park-outline/upload';
import { usePromise } from 'vierone';
import { isMimeTypeSupported } from '/src/helpers/index';
import type { Api } from '$types';

let filePickerElement = $ref<null | HTMLInputElement>(null);
let imageUrl = $ref('');
let postContent = $ref('');

function triggerPicker() {
   if (!filePickerElement) return;
   filePickerElement.click();
}

async function fileEvent(e: Event) {
   const { target } = e;
   if (!(target instanceof HTMLInputElement)) return;
   if (!target.files || target.files.length < 1) return;

   const [file] = Array.from(target.files);
   if (!isMimeTypeSupported(file.type)) {
      alert('bu dosya tipi desteklenmemektedir');
      target.value = '';
      return;
   }

   const fr = new FileReader();
   fr.onload = (e) => {
      if (!e.target || !e.target.result || typeof e.target.result !== 'string') return;
      imageUrl = e.target.result;
   };
   fr.readAsDataURL(file);
}

async function uploadPost() {
   if (!filePickerElement || !filePickerElement.files || filePickerElement.files.length < 1) {
      alert('Lütfen gerekli şeyleri seçin');
      return;
   }

   const [file] = Array.from(filePickerElement.files);

   const formData = new FormData();
   formData.set('image', file!);
   formData.set('content', postContent.trim());

   const [uploadResponse, uploadError] = await usePromise(
      fetch('http://localhost:3000/api/createpost', {
         method: 'POST',
         body: formData,
         credentials: 'same-origin'
      })
   );
   if (uploadError) {
      console.error(uploadError);
   }
}
</script>

<template>
   <div class="upload-section">
      <input class="hidden" ref="filePickerElement" @change="fileEvent" type="file" accept="image/png, image/jpeg" />

      <h3 class="page-title">Gönderi Oluştur</h3>
      <div role="button" @click="triggerPicker" class="picker-trigger">
         <img v-if="imageUrl.length > 0" :src="imageUrl" alt="text that will be uploaded" />
         <IconUpload class="icon" />
         <p>resim yüklemek için tıklayın</p>
      </div>

      <div class="post-content">
         <textarea v-model="postContent" class="area"></textarea>
      </div>

      <div class="button-section">
         <button @click="uploadPost" class="button">Gönder</button>
      </div>
   </div>
</template>

<style lang="scss" scoped>
.upload-section {
   @apply p-2 w-full max-w-750px bg-white shadow shadow-dark-900 rounded-md mx-auto;
   .page-title {
      @apply text-size-20px
             font-bold
             p-3;
   }
   .button-section {
      @apply w-full
             p-2
             text-center
             jutify-center;
      .button {
         @apply purple-button;
         // outline: none;
      }
   }
   .picker-trigger {
      @apply flex 
         items-center
         flex-col
         justify-center
         mx-auto
         relative 
         w-full 
         max-w-350px
         min-h-250px
         pb-5
         rounded-xl 
         bg-light-300
         transition-shadow
         duration-300
         cursor-pointer
         border
         boder-1px
         border-gray-200
         hover:(shadow-md border-violet-700)
         transform
         overflow-hidden
         mb-3;

      img {
         @apply mb-5;
      }

      .icon {
         @apply text-size-25px text-true-gray-700 flex-shrink-0;
      }
   }
   .post-content {
      @apply w-full h-200px  w-full flex items-start;
      .area {
         @apply border-gray-200 focus:(border-violet-700) w-full h-full outline-none border border-light-400 border-2px resize-none rounded-md p-2 text-size-14px;
      }
   }
}
</style>
