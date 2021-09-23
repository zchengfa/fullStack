import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import router from "./router/index.js";

//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'


const app = createApp(App)

//安装element-plus
app.use(ElementPlus)

//安装router
app.use(router)

//添加全局属性
//app.config.globalProperties.$router = router

app.mount('#app')

