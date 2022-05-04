<template>
  <div>
    <h3 class="text-align-center font-bold text-2xl leading-10 text-[#1620A5] my-8">
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
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
