<script lang="ts" setup>
async function fileEvent(e: Event) {
   const { target } = e;
   if (target instanceof HTMLInputElement) {
      const file = target.files?.[0];
      const formData = new FormData();
      formData.set('image', file!);
      formData.set('content', 'Follow my account please Im beginngi you');
      await fetch('http://localhost:3000/api/createpost', {
         method: 'POST',
         body: formData,
         credentials: 'include'
      });
   }
}
</script>

<template>
   <div>
      <input @change="fileEvent" type="file" name="image" accept="image/png, image/jpeg" required />
   </div>
</template>
