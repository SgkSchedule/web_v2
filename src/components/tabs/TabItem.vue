<template>
  <a href="#"
    class="border rounded border-[#1620A5] box-border
      text-center leading-5 text-[#1620A5]
      px-4 py-3.5
      w-full mb-1.5
      sm:w-1/3 sm:mr-2.5 sm:last:mr-0"
    v-bind:class="[tabActive ? ['text-white', 'bg-[#1620A5]'] : '']" v-bind="$attrs">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: ['tabActive']
}
</script>
