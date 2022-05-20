<template>
<div class="min-h-screen max-w-4xl m-auto w-full">
    <section id="rasp" class="bg-white dark:bg-gray-800 shadow-lg rounded-md max-w-4xl min-h-min p-5">
        <tab-items>
            <tab-item :tabActive="isTab('group')" @click="setTab('group')">По учебной группе</tab-item>
            <tab-item :tabActive="isTab('user')" @click="setTab('user')">По преподавателю</tab-item>
            <tab-item :tabActive="isTab('building')" @click="setTab('building')">По корпусу</tab-item>
            <tab-item :tabActive="isTab('cabinet')" @click="setTab('cabinet')">По кабинету</tab-item>
        </tab-items>

        <div v-if="isTab('group')">
          <tab-selects>
            <sche-select class="sm:w-1/3" v-model="selected.group" :options="data.groups" label="name"/>
            <sche-date-input class="sm:w-1/3" v-model="selected.date"/>
            <sche-button class="sm:w-1/3" @click="load()"/>
          </tab-selects>
        </div>

        <div v-if="isTab('user')">
          <tab-selects>
            <sche-select class="sm:w-1/2" v-model="selected.teacher" :options="data.teachers" label="name"/>
            <sche-date-input class="sm:w-1/4" v-model="selected.date"/>
            <sche-button class="sm:w-1/4" @click="load()"/>
          </tab-selects>
        </div>

        <div v-if="isTab('building')">
          <tab-selects>
            <sche-select class="sm:w-1/3" v-model="selected.building" :options="data.buildings" label="name"/>
            <sche-date-input class="sm:w-1/3" v-model="selected.date"/>
            <sche-button class="sm:w-1/3" @click="load()"/>
          </tab-selects>
        </div>

        <div v-if="isTab('cabinet')">
          <tab-selects>
            <sche-date-input class="sm:w-1/2" v-model="selected.date"/>
            <sche-button class="sm:w-1/2" @click="loadCabinets()" v-bind:class="{ 'sm:mr-4': state.cacheIncluded }">Загрузить список кабинетов</sche-button>
            <sche-button class="sm:w-1/2" v-if="state.cabinetsLoaded && state.cacheIncluded" @click="cleanCache()">Очистить кэш</sche-button>
          </tab-selects>

          <tab-selects center="true" v-if="state.cabinetsLoading">
            <loading-spinner/>
          </tab-selects>

          <tab-selects v-if="state.cabinetsLoaded">
            <sche-select class="sm:w-1/2" v-model="selected.cabinet" :options="data.cabinets" label="name"/>
            <sche-button class="sm:w-1/2" @click="load()"/>
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
            <button title="Окрыть настройки" @click="openSettings">SgkSchedule v2 (⚙️)</button><br>
            Разработано ГАПОУ "СГК"<br>
            Доработано <a href="https://github.com/maksim789456">maksim789456</a>
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
import loadingSpinner from './LoadingSpinner.vue'

export default {
  components: {
    tabItems,
    tabItem,
    tabSelects,

    scheSelect,
    scheDateInput,
    scheButton,

    scheduleView,
    loadingSpinner
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
        cabinetsLoading: false,
        cabinetsLoaded: false,
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
          if (this.selected.group.id === -1) {
            return
          }

          api.getScheduleByGroup(this.selected.group.id, this.selected.date)
            .then(result => this.rasp = result.lessons)
            .then(() => this.submite = true)
          break
        }
        case 'user': {
          if (this.selected.teacher.id === -1) {
            return
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
          if (typeof this.selected.cabinet === 'undefined' || this.selected.cabinet === null) {
            return
          }

          const cabinet = this.data.cabinets.find(x => x.id === this.selected.cabinet.id)
          this.rasp = cabinet.rasp.sort((a, b) => {
            return a.num - b.num
          })
          this.submite = true
          break
        }
      }
    },
    loadCabinets () {
      this.state.cabinetsLoading = true
      this.state.cabinetsLoaded = false
      this.state.cacheIncluded = false

      let rasp = []
      let loadingPromise
      const api = new ScheduleApi()

      const cache = localStorage.getItem(`cache.${this.selected.date}`)
      if (cache === null) {
        loadingPromise = new Promise((resolve) => {
          let groups = this.data.groups
          if (process.env.NODE_ENV === 'development') {
            console.warn('Dev mode enabled! To request used only last 5 groups!')
            groups = groups.slice(Math.max(groups.length - 5, 1))
          }

          const groupsLoadingPromises = []
          groups.forEach(group => {
            if (group.id === -1) {
              return
            }

            groupsLoadingPromises.push(api.getScheduleByGroup(group.id, this.selected.date)
              .then(result => {
                const fGroup = this.data.groups.find(x => x.id === group.id)

                result.lessons.forEach(data => {
                  data.nameGroup = fGroup.name
                  rasp.push(data)
                })
              })
            )
          })

          Promise.all(groupsLoadingPromises).then(() => {
            localStorage.setItem(`cache.${this.selected.date}`, JSON.stringify(rasp))
            this.state.cacheIncluded = true
            resolve()
          })
        })
      } else {
        loadingPromise = new Promise((resolve) => {
          rasp = JSON.parse(cache)
          resolve()
        })
      }

      loadingPromise
        .then(() => {
          this.data.cabinets = []
          let id = 0
          const rawCabinets = this.groupBy(rasp, 'cab')
          for (const key of Object.keys(rawCabinets)) {
            const rasp = rawCabinets[key]
            this.data.cabinets.push({ id: id, name: key, rasp: rasp })
            id++
          }
          this.selected.cabinet = this.data.cabinets[0]
        })
        .then(() => {
          this.state.cabinetsLoading = false
          this.state.cabinetsLoaded = true
          if (cache !== null) {
            this.state.cacheIncluded = true
          }
        })
    },
    cleanCache () {
      localStorage.removeItem(`cache.${this.selected.date}`)
      this.state.cacheIncluded = false
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

    const current = new Date() // 'Mar 11 2015' current.getTime() = 1426060964567
    const followingDay = new Date(current.getTime() + 86400000) // + 1 day in ms
    this.selected.date = followingDay.toISOString().split('T')[0]

    const api = new ScheduleApi()

    api.getGroups()
      .then(result => {
        this.data.groups = result
        this.data.groups.unshift({ id: -1, name: 'Не выбрано' })
        this.selected.group = this.data.groups[0]
      })
      .catch(error => {
        this.state.preloadFailed = true
        this.data.errors.push(error)
      })

    api.getTeachers()
      .then(teachers => {
        this.data.teachers = teachers
        this.data.teachers.unshift({ id: -1, name: 'Не выбрано' })
        this.selected.teacher = this.data.teachers[0]
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
