<template>
  <input type="date" class="rounded border border-black/10
    bg-[#F5F9FF] w-full sm:mr-4 px-4 py-3.5 mb-1.5 sm:mb-0"
    :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
</template>

<script>

export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>
