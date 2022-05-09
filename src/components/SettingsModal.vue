<template>
  <div id="settingsModal" tabindex="-1" aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full
    md:inset-0 h-modal md:h-full">
    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
        <div class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Настройки
          </h3>
          <button type="button" @click="closeModal" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
        <div class="p-6">
          <div class="flex items-start mb-3">
            <div class="flex items-center h-5">
              <input id="darkMode" type="checkbox" v-model="settings.darkMode" @change="settingsChanged($event)" class="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required>
            </div>
            <label for="darkMode" class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Темная тема</label>
          </div>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="abbreviation" type="checkbox" v-model="settings.abbreviation" @change="settingsChanged($event)" class="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required>
            </div>
            <label for="abbreviation" class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Сокращение имеи и отчества у преподавателей</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from '../../node_modules/flowbite/src/components/modal.js'
import SettingsManager from '../helpers/SettingsManager'

export default {
  emits: ['closeSettings'],
  data () {
    return {
      modal: null,
      settings: {}
    }
  },
  created () {
    this.settings = SettingsManager.getOrCreateSettings()
  },
  mounted () {
    this.modal = new Modal(document.getElementById('settingsModal'))
    this.modal.show()
  },
  methods: {
    closeModal () {
      this.modal.hide()
      this.$emit('closeSettings')
    },
    settingsChanged () {
      SettingsManager.setSettings(this.settings)
    }
  }
}
</script>
