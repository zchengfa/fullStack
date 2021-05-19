import Vue from 'vue'
import VueRouter from 'vue-router'

//安装依赖
Vue.use(VueRouter)

//路由懒加载
const Home = ()=> import ('views/home/Home')
const Category = ()=> import ('views/category/Category')
const Cart = ()=> import ('views/cart/Cart')
const Profile = ()=> import ('views/profile/Profile')
const Detail = ()=> import ('views/detail/Detail')
const Login = ()=> import('@/components/content/login/Login')
const Register = ()=> import('@/components/content/register/Register')

//创建路由映射表对象
const routes =[
	{
		path:'',
		redirect:'/home'
	},
	{
		path:'/home',
		component:Home,
		meta:{
			keepAlive:true
		}
	},
	{
		path:'/category',
		component:Category
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
		//路由传参
		path: '/detail/:product_type/:product_id',
		component:Detail
	},
	{
		path: '/login',
		component:Login
	},
	{
		path: '/register',
		component:Register
	}

]

const router = new VueRouter({
	routes,
	mode:'history'
})

export default router
