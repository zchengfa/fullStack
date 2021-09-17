import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import router from "./router";

//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'


const app = createApp(App)

//安装element-plus
app.use(ElementPlus)

//安装router
app.use(router)

app.mount('#app')

