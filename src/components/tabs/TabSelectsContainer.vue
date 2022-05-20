<template>
  <div class="flex w-full mt-2.5 items-stretch flex-wrap sm:flex-nowrap"
    v-bind:class="[center ? 'justify-center' : 'justify-between']"
    v-bind="$attrs">
      <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['center']
}
</script>
