<template>
  <div>
    <h3 class="text-align-center font-bold text-2xl leading-10 text-[#1620A5] my-8">
      Расписание занятий
    </h3>
    <ScheduleMain/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import ScheduleMain from './components/ScheduleMain.vue'

@Options({
  components: {
    ScheduleMain
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
