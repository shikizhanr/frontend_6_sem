import { createApp } from 'vue'
import { Quasar, Dialog, LocalStorage, Notify } from 'quasar'
import quasarLang from 'quasar/lang/ru'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import { pinia } from './stores'
import router from './router'
import { installGlobalErrorHandlers } from './utils/errorHandling'

const app = createApp(App)
app.use(Quasar, { plugins: { Notify, Dialog, LocalStorage }, lang: quasarLang })
app.use(pinia)
app.use(router)
installGlobalErrorHandlers(app)
app.mount('#q-app')
