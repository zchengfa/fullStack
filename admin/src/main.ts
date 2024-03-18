import { createApp } from 'vue'
import App from './App.vue'

import router,{ addDynamicRoutes } from "./router";
import { createPinia } from "pinia";
import ElementPlus from 'element-plus/lib/index'
//引入element-plus中文包
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/theme-chalk/index.css'

import toast from "./components/common/toast";
import loading from "./components/common/loading";

import mitt from "mitt";

const app = createApp(App)

//将事件总线注册为全局属性
app.config.globalProperties.$bus = mitt()


//安装ElementPlus
app.use(ElementPlus,{})

// @ts-ignore
app.use(locale)

//安装pinia
app.use(createPinia())

//动态路由添加（要在安装前就进行添加）（防止页面刷新后消失）（如果函数中使用到了pinia，需要在pinia安装后使用）
addDynamicRoutes()

//安装router
app.use(router)

//安装自定义插件
app.use(toast)
app.use(loading)

//全局的路由守卫，进入所有路由前，检测是否需要登录后才能进入
router.beforeEach((to,from,next)=>{

    //若需要登录后进入，则判断是否有token值
    if (to.meta.requireAuth){

        //有token，表示已经登录过，直接进入
        if (sessionStorage.getItem('token')){

            if(to.fullPath === '/index/preferential'){
                // @ts-ignore
                if(to.meta.rights.indexOf('push') === -1){
                    sessionStorage.setItem('pushPreferential','false')
                }
                else{
                    sessionStorage.setItem('pushPreferential','true')
                }
            }
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
    //若用户在不登录的情况下直接登录主页，并且该操作发生在动态路由添加完成之前则重定向页面到登录页
    else if(to.fullPath.indexOf('/index/') !== -1 && !Object.keys(to.meta).length){

        next({
            path:'/login',
            query:{
                redirect:from.fullPath
            }
        })
    }
    //无需登录校验，直接进入
    else {
        next()
    }

})

//全局自定义指令
app.directive('permission',{
    mounted(el,binding){
        let permission = binding.value.permission
        let effect = binding.value.effect
        //判断当前用户在当前路由中是否具备对应权限
        let metaArr = router.currentRoute.value.meta.rights

        // @ts-ignore
        if(metaArr.indexOf(permission) === -1){

           //没有该权限
            if(effect === 'disabled'){
                el.disabled = true
                el.classList.add('is-disabled')
            }
            else{
                el.parentNode.removeChild(el)
            }
        }
    }
})

app.mount('#app')
