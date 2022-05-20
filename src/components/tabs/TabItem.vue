<template>
  <a href="#"
    class="border rounded border-sgk-blue dark:border-gray-50 box-border
      text-center leading-5 text-sgk-blue dark:text-gray-50
      px-4 py-3.5
      w-full mb-1.5
      sm:w-1/3 sm:mr-2.5 sm:last:mr-0"
    v-bind:class="[tabActive ? ['!text-white', 'bg-sgk-blue', 'dark:bg-gray-700', 'dark:text-gray-50'] : '']" v-bind="$attrs">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: ['tabActive']
}
</script>
