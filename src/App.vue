<template>
  <div>
    <h3 class="text-center font-bold text-2xl leading-10 text-[#1620A5] my-8">
      Расписание занятий
    </h3>
    <ScheduleMain/>
  </div>
</template>

<script>
import ScheduleMain from './components/ScheduleMain.vue'

export default {
  components: { ScheduleMain }
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
