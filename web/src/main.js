import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store";

import toast from "@/components/common/toast";

import {URL} from "@/common/utils";
import VueLazyload from "vue-lazyload";

Vue.use(VueLazyload,{
  preLoad:1.3,
  error:'assets/image/error.png',
  loading:'assets/image/loading.gif',
  attempt:3
})

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

//全局注册自定义指令（数据加载效果）
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

//全局注册自定义指令（实现图片懒加载）
  //Vue.directive('lazyload', {
    // 指令的定义
    // bind: function(el, binding) {
    //   let lazyImageObserver = new IntersectionObserver((entries) => {
    //     entries.forEach((entry) => {
    //       let lazyImage = entry.target;
    //       // 相交率，默认是相对于浏览器视窗
    //       if(entry.intersectionRatio > 0) {
    //         lazyImage.src = binding.value;
    //         // 当前图片加载完之后需要去掉监听
    //         lazyImageObserver.unobserve(lazyImage);
    //       }
    //
    //     })
    //   })
    //   lazyImageObserver.observe(el);
    // },
 // });


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


