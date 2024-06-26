import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './assets/styles/index.css';
import App from './App.vue'
import router from './router/index'
const app = createApp(App);

const pinia = createPinia()
app.use(pinia)

createApp(App).use(router).mount('#app')
