import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store";

import toast from "@/components/common/toast";

Vue.config.productionTip = false

//将Vue实例给$bus（事件总线）并添加到Vue原型上
Vue.prototype.$bus = new Vue()

//安装toast插件
Vue.use(toast)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
