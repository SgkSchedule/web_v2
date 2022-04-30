<template>
<div class="container-rasp">
    <section id="rasp" class="bg-white shadow-lg rounded-md max-w-4xl min-h-min p-5">
        <div class="flex items-center flex-col sm:flex-row">
            <tab-item :tabActive="isTab('group')" @click="setTab('group')" label="По учебной группе"/>
            <tab-item :tabActive="isTab('user')" @click="setTab('user')" label="По преподавателю"/>
            <tab-item :tabActive="isTab('building')" @click="setTab('building')" label="По корпусу"/>
            <tab-item :tabActive="isTab('cabinet')" @click="setTab('cabinet')" label="По кабинету"/>
        </div>

        <div v-if="isTab('group')">
          <tab-selects>
            <sche-select class="sm:w-1/3" v-model="selected.group" :options="data.groups" label="name"/>
            <sche-date-input class="sm:w-1/3" v-model="selected.date"/>
            <sche-button class="sm:w-1/3" @click="load()" label="Показать"/>
          </tab-selects>
        </div>

        <div v-if="isTab('user')">
          <tab-selects>
            <sche-select class="sm:w-1/2" v-model="selected.teacher" :options="data.teachers" label="name"/>
            <sche-date-input class="sm:w-1/4" v-model="selected.date"/>
            <sche-button class="sm:w-1/4" @click="load()" label="Показать"/>
          </tab-selects>
        </div>

        <div v-if="isTab('building')">
          <tab-selects>
            <sche-select class="sm:w-1/3" v-model="selected.building" :options="data.buildings" label="name"/>
            <sche-date-input class="sm:w-1/3" v-model="selected.date"/>
            <sche-button class="sm:w-1/3" @click="load()" label="Показать"/>
          </tab-selects>
        </div>

        <div v-if="isTab('cabinet')">
          <tab-selects>
            <sche-date-input class="sm:w-1/2" v-model="selected.date"/>
            <sche-button class="sm:w-1/2" @click="loadCabinets()" v-bind:class="{ 'sm:mr-4': state.cacheIncluded }" label="Загрузить список кабинетов"/>
            <sche-button class="sm:w-1/2" v-if="state.cabinetsLoaded && state.cacheIncluded" @click="cleanCache()" label="Очистить кэш"/>
          </tab-selects>

          <tab-selects center="true" v-if="state.cabinetsLoading">
            <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </div>
          </tab-selects>

          <tab-selects v-if="state.cabinetsLoaded">
            <sche-select class="sm:w-1/2" v-model="selected.cabinet" :options="data.cabinets" label="name"/>
            <sche-button class="sm:w-1/2" @click="load()" label="Показать"/>
          </tab-selects>
        </div>

        <div class="w-full overflow-x-auto">
            <div v-if="rasp.length > 0 " class="mt-2.5">
                <div v-for="(index) in this.rasp" :key="index.id" class="flex w-full mb-1.5">
                    <div class="group-item number" v-if="index.isHeader == undefined">
                        <span class="number-rasp">
                            {{index.num}}
                        </span>
                    </div>
                    <div class="group-item time" v-if="index.isHeader == undefined">
                        <span class="time-rasp" v-html="callings[index.num]">

                        </span>
                    </div>
                    <div v-if="index.nameGroup != '' && index.nameGroup != undefined && index.nameGroup != null
                        && activeTab != 'building' && index.isHeader == undefined" class="group-item group">
                             <span class="time-rasp" v-html="index.nameGroup">
                             </span>
                         </div>
                    <div class="group-item activity" v-if="index.isHeader == undefined">
                        <div class="activity-rasp">
                            <b>
                                {{index.title}}
                            </b>
                            <br>
                            <div>
                                {{index.teachername}}
                            </div>
                             <div v-if="index.resource != ''">
                                 <hr>
                                 <div v-html="index.resource"></div>
                             </div>
                        </div>
                    </div>
                    <div class="group-item type-of-activity" v-if="index.isHeader == undefined">
                        <div class="type-of-activity-rasp">
                            <div>
                                {{index.cab}}
                            </div>
                        </div>
                    </div>
                    <div class="group-item group-name" v-if="index.isHeader != undefined">
                        <h1>{{index.name}}</h1>
                    </div>
                </div>
            </div>
             <div v-if="this.rasp.length == 0" class="alert__container">
                 <div v-if="submite">
                     <div class="alert alert__success spacer rounded-md" role="alert">
                         <p class="alert__text">Пар нет</p>
                     </div>
                 </div>
                 <div v-if="!submite">
                     <div class="alert alert__primary spacer rounded-md" role="alert">
                         <p class="alert__text">Вы ещё ничего не выбрали</p>
                     </div>
                 </div>
             </div>
        </div>
    </section>
    <section class="w-full opacity-40 mt-2">
        <div class="flex flex-col place-items-center">
          <h5 class="text-center leading-6">
            SgkSchedule v2<br>
            Разработано ГАПОУ "СГК"<br>
            Доработано maksim789456
          </h5>
          <a class="" href="https://github.com/SgkSchedule/web_v2">
            <img class="h-12 w-12" :src="require('../../public/github-logo.svg')">
          </a>
        </div>
    </section>
</div>
</template>

<script>
import PresetValues from '../helpers/PresetValues'
import ScheduleApi from '../helpers/ScheduleApi'

import tabItem from './tabs/TabItem.vue'
import tabSelects from './tabs/TabSelects.vue'

import scheSelect from './inputs/ScheSelect.vue'
import scheDateInput from './inputs/ScheDateInput.vue'
import scheButton from './inputs/ScheButton.vue'

export default {
  components: {
    tabItem,
    tabSelects,

    scheSelect,
    scheDateInput,
    scheButton
  },
  data () {
    return {
      tabs: ['group', 'user', 'building', 'cabinet'],
      activeTab: 'group',
      rasp: [],
      submite: false,
      callings: PresetValues.callings,
      data: {
        groups: [],
        teachers: [],
        buildings: PresetValues.buildings,
        cabinets: []
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
        cacheIncluded: false
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
                // Сначала закидываем заголовок с названием группы
                const fGroup = this.data.groups.find(x => x.id === group)
                this.rasp.push({ name: fGroup.name, isHeader: true })

                // Потом уже данные по расписанию
                result.lessons.forEach(data => this.rasp.push(data))
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
    }
  },
  created () {
    const current = new Date() // 'Mar 11 2015' current.getTime() = 1426060964567
    const followingDay = new Date(current.getTime() + 86400000) // + 1 day in ms
    this.selected.date = followingDay.toISOString().split('T')[0]

    const requestOptions = {
      method: 'GET'
    }

    fetch('https://mfc.samgk.ru/api/groups', requestOptions)
      .then(response => response.json())
      .then(result => {
        this.data.groups = result
        this.data.groups.unshift({ id: -1, name: 'Не выбрано' })
        this.selected.group = this.data.groups[0]
      })
      .catch(error => console.log('error', error))
    fetch('https://asu.samgk.ru/api/teachers', requestOptions)
      .then(response => response.json())
      .then(result => {
        this.data.teachers = result
        // TODO: Move this and add enable/disable button
        this.data.teachers = this.data.teachers.map(teacher => {
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
        })
        this.data.teachers.unshift({ id: -1, name: 'Не выбрано' })
        this.selected.teacher = this.data.teachers[0]
      })
      .catch(error => console.log('error', error))

    this.selected.building = this.data.buildings[0]
  }
}
</script>
