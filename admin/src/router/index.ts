import {createRouter,createWebHistory} from "vue-router";

const admin = () => import('../views/Admin.vue')
const login = () => import('../components/Login.vue')
const resetPassword = () => import('../components/ResetPassword.vue')

const routes = [
    {
        path:'/',
        redirect:'/admin'
    },
    {
        path: '/admin',
        component:admin,
        meta:{
            requireAuth:true //进入管理页面需要进行登录验证
        }
    },
    {
        path:'/login',
        component: login
    },
    {
        path: '/resetPassword',
        component: resetPassword
    }
]

const router = createRouter({
    routes,
    history:createWebHistory()
})

export default router