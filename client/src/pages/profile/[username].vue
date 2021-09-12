<script lang="ts" setup>
import IconLogout from 'virtual:vite-icons/icon-park-outline/logout';

import Page from '$comp/Page/index.vue';
import { Api } from '$types';
import { useRoute, useRouter } from 'vue-router';
import { getUserProfile } from '/src/api/getUserProfile';
import { logout as postLogout } from '/src/api/logout';
import { chunkArray } from '/src/helpers/chunkArray';
import { useAuthStore } from '/src/stores/authStore';
import { ClientOnly } from 'vite-ssr/vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const fakePhotosArray: string[] = Array(14).fill('http://localhost:3000/postimg/eOt_y7kLQ5ZYqCnzXirl8.jpg');

const profileData = await getUserProfile(route.params.username as string);

async function logOut() {
   try {
      await postLogout();
      router.push('/login');
   } catch (error) {
      const _err = error as unknown as Api.NoDataResponse | undefined;
   }
}
</script>

<template>
   <Page class="_profile-wrapper">
      <ClientOnly>
         <template v-if="!profileData"> Yükleniyor.... </template>

         <template v-else>
            <div class="profile-top">
               <div class="flex justify-between">
                  <div class="username">vierone</div>
                  <button
                     aria-label="Logout"
                     title="Logout"
                     v-if="authStore.isLogged"
                     @click="logOut"
                     class="purple-button"
                  >
                     <IconLogout />
                  </button>
               </div>
            </div>
            <div class="photos-section">
               <div v-for="photoChunk in chunkArray(profileData.posts, 3)" class="photos">
                  <div v-for="photo in photoChunk" class="photo-wrapper">
                     <div class="photo-padder">
                        <img class="photo-item" :src="photo.image" />
                     </div>
                  </div>
               </div>
            </div>
         </template>
      </ClientOnly>
   </Page>
</template>

<style lang="scss" scoped>
._profile-wrapper {
   @apply bg-white 
         rounded-md
         transform
         overflow-hidden
         shadow shadow-gray-500;
   .profile-top {
      @apply bg-light-500 p-4 shadow;
      .username {
         @apply font-bold text-size-20px;
      }
   }
   .photos-section {
      @apply p-2 w-full;
      .photos {
         @apply w-full flex-nowrap flex;
         .photo-wrapper {
            @apply p-0.5  w-full max-w-[33.3333333%];
            flex: 1;
            .photo-padder {
               @apply pb-[100%] relative w-full;
               .photo-item {
                  @apply cursor-pointer shadow hover:(scale-105 z-10 shadow-xl) 
                        transform absolute w-full 
                        h-full top-0 left-0 
                        scale-100
                        rounded-md transition-(transform shadow) duration-300;
                  object-fit: cover;
               }
            }
         }
      }
   }
}
</style>
