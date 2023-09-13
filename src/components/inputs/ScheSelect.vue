<template>
  <v-select class="rounded border border-black/10 dark:border-gray-50
    w-full px-3 pb-1.5 pt-2 mb-1.5 sm:mb-0
    bg-select-background dark:bg-transparent"
    v-bind:class="[darkMode ? 'v-select-dark' : 'v-select-light']"
    :clearable="false" :multiple="multiple" v-bind="$attrs">
      <template v-slot:no-options="{ search, searching }">
        <template v-if="searching">
          Нет результатов для запроса <em>{{ search }}</em>
        </template>
        <em v-else style="opacity: 0.5">Введите запрос для поиска</em>
      </template>
    </v-select>
</template>

<script>
import SettingsManager from '../../helpers/SettingsManager'

export default {
  props: ['multiple'],
  data () {
    return {
      darkMode: SettingsManager.getOrCreateSettings().darkMode
    }
  }
}
</script>

<style>
.v-select-light {
  --vs-dropdown-color: theme('colors.gray.900');
  --vs-selected-color: theme('colors.gray.900');

  --vs-border-color: theme('colors.select-background');
  --vs-search-input-color: theme('colors.gray.900');

  --vs-font-size: theme('fontSize.sm')
}

.v-select-dark {
  --vs-controls-color: theme('colors.gray.50');
  --vs-border-color: theme('colors.gray.800');

  --vs-dropdown-bg: theme('colors.gray.800');
  --vs-dropdown-color: theme('colors.gray.50');
  --vs-dropdown-option-color: theme('colors.gray.50');

  --vs-selected-bg: theme('colors.gray.700');
  --vs-selected-color: theme('colors.gray.50');

  --vs-search-input-color: theme('colors.gray.50');

  --vs-dropdown-option--active-bg: theme('colors.gray.700');
  --vs-dropdown-option--active-color: theme('colors.blue.200');

  --vs-font-size: theme('fontSize.sm')
}
</style>
