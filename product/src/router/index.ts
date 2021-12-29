import {createRouter,createWebHistory} from "vue-router";


const Index = () => import('../views/index/Index.vue')

const routes = [
    {
        path:'/',
        name:'index',
        component:Index
    }
]

const router = createRouter({
    routes,
    history:createWebHistory()
})

export default router