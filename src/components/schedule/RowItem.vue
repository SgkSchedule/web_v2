<template>
  <div class="bg-[#F5F9FF] border border-black/5 rounded-sm
    p-4 mr-1.5 last:mr-0
    flex items-center grow basis-1/12 justify-center"
    v-bind:class="[isGroupHeader ? ['!basis-full', 'text-base', '!bg-[#1620A5]', 'text-white'] : '']"
    v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['isGroupHeader']
}
</script>
