<template>
  <div>
    <h3 class="text-center font-bold text-2xl leading-10 text-sgk-blue dark:text-gray-50 my-8 font-title">
      Расписание занятий
    </h3>
    <ScheduleMain @openWarn="openWarnHandler" @openSettings="openSettingsHandler"/>
    <WarningScreen v-if="openWarn" :errors="errors"/>
    <SettingsModal v-if="openSettings" @closeSettings="closeSettingsHandler"/>
  </div>
</template>

<script>
import SettingsManager from './helpers/SettingsManager'

import ScheduleMain from './components/ScheduleMain.vue'
import WarningScreen from './components/WarningScreen.vue'
import SettingsModal from './components/SettingsModal.vue'

export default {
  components: { ScheduleMain, WarningScreen, SettingsModal },
  data () {
    return {
      openWarn: false,
      openSettings: false,
      errors: []
    }
  },
  methods: {
    openWarnHandler (errors) {
      this.openWarn = true
      this.errors = errors
    },
    openSettingsHandler () {
      this.openSettings = true
    },
    closeSettingsHandler () {
      this.openSettings = false
    }
  },
  mounted () {
    const settings = SettingsManager.getOrCreateSettings()

    const bodyCssClasses = ['bg-light-background', 'dark:bg-gray-900', 'dark:text-gray-50',
      'text-sm', 'font-text']
    bodyCssClasses.map(cssClass => document.body.classList.add(cssClass))

    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope');
@import url('https://fonts.googleapis.com/css2?family=Inter');
</style>
