<template>
<div class="container-rasp">
    <section id="rasp">
        <div class="tabs">
            <a href="#" class="tab tab-group" v-bind:class="{active: isTab('group')}" @click="setTab('group')">По учебной группе</a>
            <a href="#" class="tab tab-user" v-bind:class="{active: isTab('user')}" @click="setTab('user')" >По преподавателю</a>
            <a href="#" class="tab tab-building" v-bind:class="{active: isTab('building')}" @click="setTab('building')">По корпусу</a>
            <a href="#" class="tab tab-cabinet" v-bind:class="{active: isTab('cabinet')}" @click="setTab('cabinet')">По кабинету</a>
        </div>
        <div class="tap-group-wrap" v-if="isTab('group')">
            <div class="row-select">
                <form action="#" class="justify-between">
                    <v-select class="select-s w-full sm:w-1/3 sm:mr-4 px-3 py-2 mb-1.5 sm:mb-0" v-model="selected.group" :options="data.groups" label="name"></v-select>
                    <input type="date" class="w-full sm:w-1/3 sm:mr-4" name="date" v-model="selected.date" id="date">
                    <button type="button" class="bg-[#1620A5] text-gray-50 rounded w-full sm:w-1/3 px-4 py-3.5" @click="load()">Показать</button>
                </form>
            </div>
        </div>

        <div class="tap-user-wrap" v-if="isTab('user')">
            <div class="row-select">
                <form action="#">
                    <v-select class="select-s w-full sm:w-1/2 sm:mr-4 px-3 py-2 mb-1.5 sm:mb-0" v-model="selected.teacher" :options="data.teachers" label="name"></v-select>
                    <input type="date" class="w-full sm:w-1/4 sm:mr-4" name="date" v-model="selected.date" id="date">
                    <button type="button" class="bg-[#1620A5] text-gray-50 rounded w-full sm:w-1/4 px-4 py-3.5" @click="load()">Показать</button>
                </form>
            </div>
        </div>

        <div class="tap-user-wrap" v-if="isTab('building')">
            <div class="row-select">
                <form action="#">
                    <v-select class="select-s w-full sm:w-1/3 sm:mr-4 px-3 py-2 mb-1.5 sm:mb-0" v-model="selected.building" :options="data.buildings" label="name"></v-select>
                    <input type="date" class="w-full sm:w-1/3 sm:mr-4" name="date" v-model="selected.date" id="date">
                    <button type="button" class="bg-[#1620A5] text-gray-50 rounded w-full sm:w-1/3 px-4 py-3.5" @click="load()">Показать</button>
                </form>
            </div>
        </div>

        <div class="tap-user-wrap" v-if="isTab('cabinet')">
            <div class="row-select">
                <form action="#">
                    <input type="date" class="w-full sm:w-1/2 sm:mr-4" name="date" v-model="selected.date" id="date">
                    <button type="button" class="bg-[#1620A5] text-gray-50 rounded w-full sm:w-1/2 px-4 py-3.5" @click="loadCabinets()">Загрузить список кабинетов</button>
                </form>
            </div>
            <div class="row-select" v-if="state.cabinetsLoading">
                <form action="#" class="flex justify-center">
                    <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                      <span class="visually-hidden">Загрузка...</span>
                    </div>
                </form>
            </div>
            <div class="row-select" v-if="state.cabinetsLoaded">
                <form action="#">
                    <v-select class="select-s w-full sm:w-1/2 sm:mr-4 px-3 py-2 mb-1.5 sm:mb-0" v-model="selected.cabinet" :options="data.cabinets" label="name"></v-select>
                    <button type="button" class="bg-[#1620A5] text-gray-50 rounded w-full sm:w-1/2 px-4 py-3.5" @click="load()">Показать</button>
                </form>
            </div>
        </div>
        <div class="result">
            <div v-if="rasp.length > 0 " class="line-groups">
                <div v-for="(index) in this.rasp" :key="index.id" class="line-group">
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
                        && activeTab != 'building' && index.isHeader == undefined" class="group-item time">
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
                     <div class="alert alert__success spacer" role="alert">
                         <p class="alert__text">Пар нет</p>
                     </div>
                 </div>
                 <div v-if="!submite">
                     <div class="alert alert__primary spacer" role="alert">
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
          <a class="" href="https://github.com/maksim789456/SgkSchedule">
            <img class="h-12 w-12" :src="require('../../public/github-logo.svg')">
          </a>
        </div>
    </section>
</div>
</template>

<script>
import PresetValues from '../helpers/PresetValues'
import ScheduleApi from '../helpers/ScheduleApi'

export default {
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
        cabinetsLoaded: false
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
          break
        }
        case 'user': {
          if (this.selected.teacher.id === -1) {
            return
          }

          ScheduleApi.getScheduleByUser(this.selected.teacher.id, this.selected.date)
            .then(result => this.rasp = result.lessons)
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
          groups.forEach(group => {
            // Получаем данные по группе
            ScheduleApi.getScheduleByGroup(group, this.selected.date)
              .then(result => {
                // Сначала закидываем заголовок с названием группы
                const fGroup = this.data.groups.find(x => x.id === group)
                this.rasp.push({ name: fGroup.name, isHeader: true })

                // Потом уже данные по расписанию
                result.lessons.forEach(data => this.rasp.push(data))
              })
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
          break
        }
      }
      this.submite = true
    },
    loadCabinets () {
      this.state.cabinetsLoading = true
      this.state.cabinetsLoaded = false

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
        })
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
