import { createRouter, createWebHistory, useRouter } from "vue-router";
import { userStore } from "../pinia/pinia";

const admin = () => import('../views/Admin.vue')
const login = () => import('../components/Login.vue')

const index = () => import('../views/index.vue')
const resetPassword = () => import('../components/ResetPassword.vue')
const L = ()=> import('../components/admin/dataStatistics/UserLocationChartStatistics.vue')

const goods  = () => import('../components/admin/shopManage/ShopManage.vue')
const user = () => import('../components/admin/memberManage/MemberManage.vue')

const routeMapping:any = {
    '/goods':{path:'goods',component: goods},
    '/user':{path:'user',component: user}
}

const routes = [
    {
        path:'/',
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
        path:'/login',
        component: login
    },
    {
        path: '/resetPassword',
        component: resetPassword
    },
    {
        path: '/l',
        component:L
    }
]


const router = createRouter({
    routes,
    history:createWebHistory()
})

//根据后端返回的菜单权限数据来给index页面动态添加路由
export function addDynamicRoutes(){
    let { rights } = userStore()
    if(rights){
        rights.forEach((item:any)=>{
            item.children.forEach((child:any)=>{
                router.addRoute('index',routeMapping[child.path])

            })
        })
    }

}




export default router