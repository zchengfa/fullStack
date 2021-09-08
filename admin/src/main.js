import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

const app = createApp(App)

//安装element-plus
app.use(ElementPlus)

app.mount('#app')
