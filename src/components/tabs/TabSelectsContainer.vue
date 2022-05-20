<template>
  <div class="flex w-full mt-2.5 flex-wrap sm:flex-nowrap"
    v-bind:class="[center ? ['justify-center'] : ['justify-between', 'items-stretch']]"
    v-bind="$attrs">
      <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['center']
}
</script>
