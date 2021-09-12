<script lang="ts" setup>
import Page from '$comp/Page/index.vue';
import LoginOrSignupForm from '$comp/LoginOrSignupForm/index.vue';
</script>

<template>
   <Page class="_page">
      <LoginOrSignupForm type="signup" />
   </Page>
</template>

<style lang="scss" scoped>
._page {
   @apply p-6 bg-white text-center rounded-md;
}
</style>
