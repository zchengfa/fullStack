import { createApp } from 'vue'
import App from './App.vue'

import router from "./router";
import ElementPlus from 'element-plus/lib/index'
import 'element-plus/theme-chalk/index.css'

const app = createApp(App)

//安装ElementPlus
app.use(ElementPlus,{})

//安装router
app.use(router)

//全局的路由守卫，进入所有路由前，检测是否需要登录后才能进入
router.beforeEach((to,from,next)=>{
    //若需要登录后进入，则判断是否有token值
    if (to.meta.requireAuth){
        //有token，表示已经登录过，直接进入
        if (sessionStorage.getItem('token')){
            next()
        }
        //没有token，表示未登录，重定向到登录页
        else {
            next({
                path:'/login',
                query:{
                    redirect:from.fullPath
                }
            })
        }
    }
    //无需登录校验，直接进入
    else {
        next()
    }
})

app.mount('#app')
