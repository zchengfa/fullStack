import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store";

import toast from "@/components/common/toast";

import {URL} from "@/common/utils";


//将用户token值加入到vue原型中成为全局变量
// const token = sessionStorage.getItem('token')
// Vue.prototype.$token = token

//全局的路由守卫
// router.beforeEach((to, from, next) => {
//   if (to.name === from.name && to.params.type !== from.params.type) {
//     next({ name: 'empty', query: { toPath: to.fullPath } })
//   } else {
//     next()
//   }
// })
//
//   // 中间过渡路由
//   let toPath = this.$route.query.toPath
//   if (toPath) {
//     this.$router.push({ path: this.toPath }).then()
//   }

//将请求地址加入到vue原型中成为全局变量
Vue.prototype.$link = URL

Vue.config.productionTip = false

//将Vue实例给$bus（事件总线）并添加到Vue原型上
Vue.prototype.$bus = new Vue()

//安装toast插件
Vue.use(toast)

//全局注册自定义指令
Vue.directive('loading',{
  update(el,binding){
    if (binding.value === true){
      el.style.display = 'block'
    }
    else{
      el.style.display = 'none'
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
