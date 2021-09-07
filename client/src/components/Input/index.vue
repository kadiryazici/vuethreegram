<script lang="ts">
export default {
   name: 'Input'
};
</script>

<script lang="ts" setup>
interface Props {
   modelValue: string;
   trim?: boolean;
}
interface Emits {
   (e: 'update:modelValue', v: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function handleOnInput(e: Event) {
   const { target } = e;
   if (target instanceof HTMLInputElement) {
      const { value } = target;
      emit('update:modelValue', value);
   }
}
function handleOnChange() {
   if (!props.trim) return;
   emit('update:modelValue', props.modelValue.trim());
}
</script>

<template>
   <input class="_input" :value="modelValue" @change="handleOnChange" @input="handleOnInput" type="text" />
</template>

<style lang="scss" scoped>
._input {
   @apply bg-gray-200 
         shadow
         transition-shadow
         transition-colors
         duration-300
         border-1px
         border-transparent
         border-solid
         rounded-md
         text-size-14px
         focus:(outline-none bg-violet-700 text-white shadow-xl)
         py-2 
         px-2;
}
</style>
