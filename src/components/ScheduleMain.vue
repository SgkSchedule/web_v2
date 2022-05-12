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
            <svg role="status" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </tab-selects>

          <tab-selects v-if="state.cabinetsLoaded">
            <sche-select class="sm:w-1/2" v-model="selected.cabinet" :options="data.cabinets" label="name"/>
            <sche-button class="sm:w-1/2" @click="load()"/>
          </tab-selects>
        </div>

        <div class="w-full overflow-x-auto">
            <div v-if="rasp.length > 0 " class="mt-2.5">
                <div v-for="(index) in this.rasp" :key="index.id" class="flex w-full mb-1.5">
                  <row-item v-if="index.isHeader == undefined">
                    <span>{{index.num}}</span>
                  </row-item>
                  <row-item class="!basis-[10%]" v-if="index.isHeader == undefined">
                    <span v-html="callings[index.num]"></span>
                  </row-item>
                  <row-item v-if="index.nameGroup != '' && index.nameGroup != undefined && index.nameGroup != null
                    && activeTab != 'building' && index.isHeader == undefined" class="!basis-2/12">
                      <span v-html="index.nameGroup"></span>
                  </row-item>
                  <row-item class="!basis-7/12 !justify-start" v-if="index.isHeader == undefined">
                    <div>
                      <b>{{index.title}}</b><br>
                      <div>{{index.teachername}}</div>
                      <div v-if="index.resource != ''">
                        <hr>
                        <div v-html="index.resource"></div>
                      </div>
                    </div>
                  </row-item>
                  <row-item v-if="index.isHeader == undefined">
                      <div>
                        {{index.cab}}
                      </div>
                  </row-item>
                  <row-item v-if="index.isHeader != undefined" isGroupHeader="true">
                      <h1>{{index.name}}</h1>
                  </row-item>
                </div>
            </div>
             <div v-if="this.rasp.length == 0" class="mt-5">
                 <div v-if="submite">
                    <div class="p-4 mb-0.5 text-base text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                      Пар нет
                    </div>
                 </div>
                 <div v-if="!submite">
                   <div class="p-4 mb-0.5 text-base text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800" role="alert">
                     Вы ещё ничего не выбрали
                  </div>
                 </div>
             </div>
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

import rowItem from './schedule/RowItem.vue'

export default {
  components: {
    tabItems,
    tabItem,
    tabSelects,

    scheSelect,
    scheDateInput,
    scheButton,

    rowItem
  },
  emits: ['openWarn', 'openSettings'],
  data () {
    return {
      tabs: ['group', 'user', 'building', 'cabinet'],
      activeTab: 'group',
      rasp: [],
      submite: false,
      callings: PresetValues.callings,
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
      switch (this.activeTab) {
        case 'group': {
          if (this.selected.group.id === -1) {
            return
          }

          ScheduleApi.getScheduleByGroup(this.selected.group.id, this.selected.date)
            .then(result => this.rasp = result.lessons)
            .then(() => this.submite = true)
          break
        }
        case 'user': {
          if (this.selected.teacher.id === -1) {
            return
          }

          ScheduleApi.getScheduleByUser(this.selected.teacher.id, this.selected.date)
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
            groupsLoadingPromises.push(ScheduleApi.getScheduleByGroup(group, this.selected.date)
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

            groupsLoadingPromises.push(ScheduleApi.getScheduleByGroup(group.id, this.selected.date)
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

    const requestOptions = {
      method: 'GET'
    }

    fetch('https://mfc.samgk.ru/api/groups', requestOptions)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error('Groups api error')
      })
      .then(result => {
        this.data.groups = result
        this.data.groups.unshift({ id: -1, name: 'Не выбрано' })
        this.selected.group = this.data.groups[0]
      })
      .catch(error => {
        this.state.preloadFailed = true
        this.data.errors.push(error)
      })
    fetch('https://asu.samgk.ru/api/teachers', requestOptions)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
        throw new Error('Teacher api error')
      })
      .then(result => {
        return new Promise(resolve => {
          if (this.settings.abbreviation === true) {
            resolve(result.map(teacher => {
              const splited = teacher.name.replace(/\s+/g, ' ').trim().split(' ')
              if (splited.length === 2) {
                const lastName = splited[0]
                const firstNameChar = splited[1][0]
                teacher.name = `${lastName} ${firstNameChar}.`
              }

              if (splited.length >= 3) {
                const lastName = splited[0]
                const firstNameChar = splited[1][0]
                const middleNameChar = splited[2][0]
                teacher.name = `${lastName} ${firstNameChar}. ${middleNameChar}.`
              }

              return teacher
            }))
          } else {
            resolve(result)
          }
        })
      })
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
