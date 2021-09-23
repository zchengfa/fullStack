import { createApp } from 'vue'
import App from './App.vue'

import router from "./router";
import ElementPlus from 'element-plus/lib/index'
import 'element-plus/theme-chalk/index.css'

const app = createApp(App)

//安装ElementPlus
app.use(ElementPlus)

//安装router
app.use(router)



app.mount('#app')
