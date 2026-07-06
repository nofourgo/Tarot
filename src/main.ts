import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Kiểu cơ bản
import '@/assets/less/main.less'
// tailwind-base
import '@/assets/tailwind-base.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
