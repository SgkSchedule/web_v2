<template>
  <div>
    <h3 class="text-center font-bold text-2xl leading-10 text-[#1620A5] dark:text-gray-50 my-8 font-title">
      Расписание занятий
    </h3>
    <ScheduleMain @openWarn="openWarnHadler"/>
    <warning-screen v-if="openWarn" :errors="errors"/>
  </div>
</template>

<script>
import ScheduleMain from './components/ScheduleMain.vue'
import WarningScreen from './components/WarningScreen.vue'

export default {
  components: { ScheduleMain, WarningScreen },
  data () {
    return {
      openWarn: false,
      errors: []
    }
  },
  methods: {
    openWarnHadler (errors) {
      this.openWarn = true
      this.errors = errors
    }
  },
  mounted () {
    const bodyCssClasses = ['bg-light-background', 'dark:bg-gray-900', 'dark:text-gray-50',
      'text-sm', 'font-text']
    bodyCssClasses.map(cssClass => document.body.classList.add(cssClass))
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope');
@import url('https://fonts.googleapis.com/css2?family=Inter');
</style>
