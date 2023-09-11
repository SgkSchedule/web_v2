<template>
<div class="max-w-4xl m-auto w-full">
    <section id="rasp" class="bg-white dark:bg-gray-800 shadow-lg rounded-md max-w-4xl min-h-min p-5">
        <tab-items>
            <tab-item :tabActive="isTab('group')" @click="setTab('group')">По учебной группе</tab-item>
            <tab-item :tabActive="isTab('user')" @click="setTab('user')">По преподавателю</tab-item>
            <tab-item :tabActive="isTab('building')" @click="setTab('building')">По корпусу</tab-item>
            <tab-item :tabActive="isTab('cabinet')" @click="setTab('cabinet')">По кабинету</tab-item>
        </tab-items>

        <div v-if="isTab('group')">
          <tab-selects>
            <sche-select class="sm:w-1/3 sm:mr-4" v-model="selected.group" :options="data.groups" :multiple="settings.multipleSelection"
              :placeholder="settings.multipleSelection ? 'Выберите группы' : 'Выберите группу'" label="name"/>
            <sche-date-input class="sm:w-1/3 sm:mr-4" v-model="selected.date"/>
            <sche-button class="sm:w-1/3" @click="load()"/>
          </tab-selects>
        </div>

        <div v-if="isTab('user')">
          <tab-selects>
            <sche-select class="sm:w-1/2 sm:mr-2.5" v-model="selected.teacher" :options="data.teachers" :multiple="settings.multipleSelection"
              :placeholder="settings.multipleSelection ? 'Выберите преподавателей' : 'Выберите преподавателя'" label="name"/>
            <div class="flex w-full flex-wrap sm:flex-nowrap sm:w-1/2">
              <sche-date-input class="sm:mr-2.5" v-model="selected.date"/>
              <sche-button class="sm:mr-0" @click="load()"/>
            </div>
          </tab-selects>
        </div>

        <div v-if="isTab('building')">
          <tab-selects>
            <sche-select class="sm:w-1/3 sm:mr-4" v-model="selected.building" :options="data.buildings" label="name"/>
            <sche-date-input class="sm:w-1/3 sm:mr-4" v-model="selected.date"/>
            <sche-button class="sm:w-1/3" @click="load()"/>
          </tab-selects>
        </div>

        <div v-if="isTab('cabinet')">
          <tab-selects>
            <sche-select class="sm:w-1/3 sm:mr-4" v-model="selected.cabinet" :options="data.cabinets" :multiple="settings.multipleSelection"
              :placeholder="settings.multipleSelection ? 'Выберите кабинеты' : 'Выберите кабинет'" label="name"/>
            <sche-date-input class="sm:w-1/3 sm:mr-4" v-model="selected.date"/>
            <sche-button class="sm:w-1/3" @click="load()"/>
          </tab-selects>
        </div>

        <div v-if="this.rasp.length == 0" class="w-full overflow-x-auto mt-5">
          <div v-bind:class="[submite ? 'success-alert' : 'info-alert']" role="alert">
            <p v-if="!submite">Вы ещё ничего не выбрали</p>
            <p v-else>Пар нет</p>
          </div>
        </div>

        <div v-if="rasp.length > 0" class="w-full overflow-x-auto mt-5">
          <schedule-view :rasp="this.rasp" :printGroupName="this.activeTab != 'building'"/>
        </div>
    </section>
    <section class="w-full opacity-40 mt-2">
        <div class="flex flex-col place-items-center">
          <h5 class="text-center leading-6">
            <button title="Окрыть настройки" @click="openSettings">SgkSchedule v2.1 (⚙️)</button><br>
            Copyright © 2022 <a href="https://github.com/maksim789456">maksim789456</a>, <a href="https://samgk.ru/">ГАПОУ "СГК"</a>
          </h5>
          <a href="https://github.com/SgkSchedule/web_v2">
            <img class="h-12 w-12 dark:invert" :src="require('../../public/github-logo.svg')">
          </a>
        </div>
    </section>
</div>
</template>

<script>
import PresetValues from '../helpers/PresetValues'
import ScheduleApi from '../helpers/ScheduleApi'
import SettingsManager from '../helpers/SettingsManager'

import tabItems from './tabs/TabItemsContainer.vue'
import tabItem from './tabs/TabItem.vue'
import tabSelects from './tabs/TabSelectsContainer.vue'

import scheSelect from './inputs/ScheSelect.vue'
import scheDateInput from './inputs/ScheDateInput.vue'
import scheButton from './inputs/ScheButton.vue'

import scheduleView from './schedule/ScheduleView.vue'

export default {
  components: {
    tabItems,
    tabItem,
    tabSelects,

    scheSelect,
    scheDateInput,
    scheButton,

    scheduleView
  },
  emits: ['openWarn', 'openSettings'],
  data () {
    return {
      tabs: ['group', 'user', 'building', 'cabinet'],
      activeTab: 'group',
      rasp: [],
      submite: false,
      settings: {},
      data: {
        groups: [],
        teachers: [],
        buildings: PresetValues.buildings,
        cabinets: [],
        errors: []
      },
      selected: {
        teacher: null,
        group: null,
        building: null,
        cabinet: null,
        date: new Date().toISOString().split('T')[0]
      },
      state: {
        cacheIncluded: false,
        preloadFailed: false
      }
    }
  },
  methods: {
    isTab (tab) {
      return tab === this.activeTab
    },
    setTab (tab) {
      this.activeTab = tab
      this.submite = false
      this.rasp = []
    },
    load () {
      const api = new ScheduleApi()
      switch (this.activeTab) {
        case 'group': {
          if (this.selected.group === null || this.selected.group === []) {
            return
          }

          if (this.settings.multipleSelection) {
            this.rasp = []
            const groupsLoadingPromises = []

            this.selected.group.forEach(group => {
              groupsLoadingPromises.push(
                api.getScheduleByGroup(group.id, this.selected.date)
                  .then(result => {
                    if (result.lessons.length > 0) {
                      if (this.selected.group.length > 1) {
                        this.rasp.push({ name: group.name, isHeader: true })
                      }
                      result.lessons.forEach(data => this.rasp.push(data))
                    }
                  })
              )
            })

            Promise.all(groupsLoadingPromises)
              .then(this.submite = true)
            break
          }

          api.getScheduleByGroup(this.selected.group.id, this.selected.date)
            .then(result => this.rasp = result.lessons)
            .then(() => this.submite = true)
          break
        }
        case 'user': {
          if (this.selected.teacher === null || this.selected.teacher === []) {
            return
          }

          if (this.settings.multipleSelection) {
            this.rasp = []
            const teacherLoadingPromises = []

            this.selected.teacher.forEach(teacher => {
              teacherLoadingPromises.push(
                api.getScheduleByUser(teacher.id, this.selected.date)
                  .then(result => {
                    if (result.lessons.length > 0) {
                      if (this.selected.teacher.length > 1) {
                        this.rasp.push({ name: teacher.name, isHeader: true })
                      }
                      result.lessons.forEach(data => this.rasp.push(data))
                    }
                  })
              )
            })

            Promise.all(teacherLoadingPromises)
              .then(this.submite = true)
            break
          }

          api.getScheduleByUser(this.selected.teacher.id, this.selected.date)
            .then(result => this.rasp = result.lessons)
            .then(() => this.submite = true)
          break
        }
        case 'building': {
          this.rasp = []

          // Максимально отвратное решение но других методов апи нету
          // Разраб оригинального сайта, если ты это читаешь то сделай нормальный метод и переделай это !!!
          const building = this.data.buildings.find(x => x.id === this.selected.building.id)

          let groups = building.groups
          if (process.env.NODE_ENV === 'development') {
            console.warn('Dev mode enabled! To request used only last 5 groups!')
            groups = groups.slice(Math.max(groups.length - 5, 1))
          }
          // Проходимся по всем групппах из корпуса
          const groupsLoadingPromises = []
          groups.forEach(group => {
            // Получаем данные по группе
            groupsLoadingPromises.push(api.getScheduleByGroup(group, this.selected.date)
              .then(result => {
                if (result.lessons.length > 0) {
                  // Сначала закидываем заголовок с названием группы
                  const fGroup = this.data.groups.find(x => x.id === group)
                  this.rasp.push({ name: fGroup.name, isHeader: true })

                  // Потом уже данные по расписанию
                  result.lessons.forEach(data => this.rasp.push(data))
                }
              }))
          })
          Promise.all(groupsLoadingPromises)
            .then(() => {
              this.submite = true
            })
          break
        }
        case 'cabinet': {
          if (this.selected.cabinet === null || this.selected.cabinet === []) {
            return
          }

          if (this.settings.multipleSelection) {
            this.rasp = []
            const cabinetLoadingPromises = []

            this.selected.cabinet.forEach(cabinet => {
              cabinetLoadingPromises.push(
                api.getScheduleByCabinet(cabinet.id, this.selected.date)
                  .then(result => {
                    if (result.lessons.length > 0) {
                      if (this.selected.cabinet.length > 1) {
                        this.rasp.push({ name: cabinet.name, isHeader: true })
                      }
                      result.lessons.forEach(data => this.rasp.push(data))
                    }
                  })
              )
            })

            Promise.all(cabinetLoadingPromises)
              .then(this.submite = true)
            break
          }

          api.getScheduleByCabinet(this.selected.cabinet.id, this.selected.date)
            .then(result => this.rasp = result.lessons)
            .then(() => this.submite = true)
        }
      }
    },
    groupBy (xs, key) {
      return xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
      }, {})
    },
    openSettings () {
      this.$emit('openSettings')
    }
  },
  created () {
    this.settings = SettingsManager.getOrCreateSettings()

    const current = new Date()
    if (this.settings.addDayToCurrentDate) {
      current.setDate(current.getDate() + 1)
    }
    this.selected.date = current.toISOString().split('T')[0]

    const api = new ScheduleApi()

    api.getGroups()
      .then(result => {
        this.data.groups = result
      })
      .catch(error => {
        this.state.preloadFailed = true
        this.data.errors.push(error)
      })

    api.getTeachers()
      .then(teachers => {
        this.data.teachers = teachers
      })
      .catch(error => {
        this.state.preloadFailed = true
        this.data.errors.push(error)
      })

    api.getCabinets()
      .then(cabinets => {
        this.data.cabinets = Object.keys(cabinets).map(key => ({
          id: key,
          name: cabinets[key]
        }))
      })
      .catch(error => {
        this.state.preloadFailed = true
        this.data.errors.push(error)
      })

    this.selected.building = this.data.buildings[0]

    if (this.state.preloadFailed) {
      this.$emit('openWarn', this.data.errors)
    }
  }
}
</script>
