import {createRouter,createWebHistory} from "vue-router";

const routes = [
    {
        path:'/',
        component:() => import('../views/Admin.vue')
    },
    {
        path:'/login',
        component:() => import('../components/Login.vue')
    }
]

const router = createRouter({
    routes,
    history:createWebHistory()
})

export default router