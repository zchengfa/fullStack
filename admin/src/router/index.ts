import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import { userStore } from "../pinia/pinia";

//const admin = () => import('../views/Admin.vue')
const login = () => import('../components/Login.vue')

const index = () => import('../views/index.vue')
const resetPassword = () => import('../components/ResetPassword.vue')
const L = ()=> import('../components/admin/dataStatistics/UserLocationChartStatistics.vue')

const routeMapping:any = {
    '/goods':{path:'goods',name:'goods',component: () => import('../components/admin/shopManage/ShopManage.vue')},
    '/user':{path:'user',name:'user',component: () => import('../components/admin/memberManage/MemberManage.vue')},
    '/banner':{path:'banner',name:'banner',component: () => import('../components/admin/swiperManage/SwiperManage.vue')},
    '/grounding':{path:'grounding',name:'grounding',component: () => import('../components/admin/groundManage/GroundManage.vue')},
    '/seckill':{path:'seckill',name:'seckill',component: () => import('../components/admin/seckillManage/SeckillManage.vue')},
    '/order':{path:'order',name:'order',component: () => import('../components/admin/orderManage/OrderManage.vue')},
    '/dataMonitor':{path:'dataMonitor',name:'dataMonitor',component: () => import('../components/admin/dataStatistics/DataStatistics.vue')},
    '/preferential':{path:'preferential',name:'preferential',component: () => import('../components/admin/preferentialManage/PreferentialManage.vue')},
    '/dataVisualization':{path:'dataVisualization',name:'dataVisualization',component: () => import('../components/admin/dataStatistics/LargeScreenVisualization.vue')},
}

const routes = [
    {
        path:'/',
        name:'/',
        redirect:'/index'
    },
    {
        path: '/index',
        name:'index',
        component:index,
        meta:{
            requireAuth:true //进入管理页面需要进行登录验证
        },
    },
    {
        name: 'login',
        path:'/login',
        component: login
    },
    {
        path: '/resetPassword',
        name: 'resetPassword',
        component: resetPassword
    },
    {
        path: '/l',
        name: 'l',
        component:L
    }
]


const router = createRouter({
    routes,
    history:createWebHashHistory()
})

//根据后端返回的菜单权限数据来给index页面动态添加路由
export function addDynamicRoutes(){
    let { rights } = userStore()

    if(rights){
        rights.forEach((item:any)=>{
            item.children?.forEach((child:any)=>{
                if(routeMapping[child.path]){
                    const temp = routeMapping[child.path]
                    temp.meta = {
                        rights:child.rights
                    }

                    router.addRoute('index',temp)
                }
            })
        })
    }
}




export default router