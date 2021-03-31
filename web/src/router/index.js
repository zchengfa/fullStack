import Vue from 'vue'
import VueRouter from 'vue-router'

//安装依赖
Vue.use(VueRouter)

//路由懒加载
const Home = ()=> import ('views/home/Home')
const About = ()=> import ('views/about/About')
const Cart = ()=> import ('views/cart/Cart')
const Profile = ()=> import ('views/profile/Profile')
const Detail = ()=> import ('views/detail/Detail')

//创建路由映射表对象
const routes =[
	{
		path:'',
		redirect:'/home'
	},
	{
		path:'/home',
		component:Home
	},
	{
		path:'/about',
		component:About
	},
	{
		path:'/cart',
		component:Cart
	},
	{
		path:'/profile',
		component:Profile
	},
	{
		path: '/detail/:product_id',
		component:Detail
	}
]

const router = new VueRouter({
	routes,
	mode:'history'
})

export default router
