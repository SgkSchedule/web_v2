<template>
  <div class="bg-select-background dark:bg-gray-700 border border-black/5 rounded-sm
    p-4 min-w-full
    flex items-center grow justify-center"
    v-bind:class="[isGroupHeader ? ['text-base', '!bg-sgk-blue', 'text-white'] : '']"
    v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['isGroupHeader']
}
</script>
