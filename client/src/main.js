import { createApp } from 'vue'
import naive from "naive-ui"
import { createDiscreteApi } from 'naive-ui'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './common/router'
import { adminstore } from "./stores/adminstore"
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

const { message, notification, dialog } = createDiscreteApi(['message', 'dialog', 'notification'])
const app = createApp(App)

app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)
app.provide("axios", axios)

app.use(router)
app.use(naive)
app.use(createPinia())
const adminStore = adminstore();
axios.interceptors.request.use((config) => {
    config.headers.token = adminStore.token;
    return config;
})
app.mount('#app')
