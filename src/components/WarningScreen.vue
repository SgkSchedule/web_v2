<template>
  <div id="waringModal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Сайт времено недоступен
                </h3>
            </div>
            <div class="p-6 text-center">
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400 pb-3">
                  По техническим причинам сайт времено не доступен!<br>
                </p>
                <div class="opacity-40" v-for="(error) in this.errors" :key="error">
                  <p>{{error}}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Modal from '../../node_modules/flowbite/src/components/modal.js'

export default {
  props: ['errors'],
  mounted () {
    new Modal(document.getElementById('waringModal')).show()
  }
}
</script>
