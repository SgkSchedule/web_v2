<template>
  <input type="date" class="rounded border border-black/10 text-sm font-text text-black
  bg-select-background dark:bg-transparent dark:text-white dark:border-gray-50 dark:input-scheme-dark
  w-full px-4 py-3.5 mb-1.5 sm:mb-0"
    :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
</template>

<script>

export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>
