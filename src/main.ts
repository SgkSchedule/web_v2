import { createApp, h } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './css/style.css'
import 'flowbite'
import 'vue-select/dist/vue-select.css'

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { VueSelect as vSelect } from 'vue-select'

const app = createApp({
  render: () => h(App)
})

app.component('v-select', vSelect)

app.mount('#app')
