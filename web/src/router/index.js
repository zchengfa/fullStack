import Vue from 'vue'
import VueRouter from 'vue-router'

//安装依赖
Vue.use(VueRouter)

//重写vue-router的push方法，解决路由跳转到同一路径报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
	return originalPush.call(this,location).catch(err => err)
}

//路由懒加载
const Home = ()=> import ('views/home/Home.vue')
const Category = ()=> import ('views/category/Category.vue')
const Cart = ()=> import ('views/cart/Cart.vue')
const Profile = ()=> import ('views/profile/Profile.vue')
const Detail = ()=> import ('views/detail/Detail.vue')
const Login = ()=> import('@/components/content/login/Login.vue')
const Register = ()=> import('@/components/content/register/Register.vue')
const Customer = ()=> import('@/components/content/customer/Customer.vue')
const TermsService = ()=> import('@/components/content/register/TermsService.vue')
const ProductCollection = ()=> import('@/views/profile/components/ProductCollection.vue')
const BannerDetail = ()=> import('@/views/homeContent/BannerDetail.vue')
const ChatForCustomer = () => import('@/views/chatForCustomer/chatForCustomer.vue')
const Order = () => import('@/views/order/Order.vue')
const PaymentStatus = ()=> import('@/views/order/PaymentStatus.vue')
const OrderStatus = ()=> import('@/views/order/OrderStatus.vue')
const UserInformation = ()=> import('@/views/profile/components/User.vue')
const ManageAddress = ()=> import('@/views/profile/components/ManageAddress.vue')
const AddAddress = ()=> import('@/views/profile/components/AddAddress.vue')
const FlashSale = ()=> import('@/components/content/flashSale/FlashSale.vue')
const SearchProduct = ()=> import('@/views/homeContent/SearchProduct.vue')
const WaitComments = ()=> import('@/views/homeContent/WaitComments.vue')
const Comments = ()=> import('@/views/homeContent/Comments.vue')
const Avatar = ()=> import('@/views/profile/components/Avatar.vue')

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
			keepAlive:true,
			hiddeTabBar:false
		}
	},
	{
		path:'/category',
		component:Category,
		meta:{
			keepAlive:true,
			hiddeTabBar: false
		}
	},
	{
		path:'/cart',
		component:Cart,
		meta: {
			hiddeTabBar:false
		}
	},
	{
		path:'/profile',
		component:Profile,
		meta: {
			hiddeTabBar:false
		}
	},
	{
		//路由传参
		path: '/detail/:sell_type/:product_type/:product_id/:id',
		name:'detail',
		component:Detail
	},
	{
		path: '/login',
		component:Login
	},
	{
		path: '/register',
		component:Register
	},
	{
		path: '/customer/:receiver',
		component:Customer,
	},
	{
		path: '/chatForCustomer',
		component:ChatForCustomer,
	},
	{
		path: '/termsService',
		component:TermsService
	},
	{
		path: '/productCollection',
		component:ProductCollection
	},
	{
		path: '/homeContent',
		name:'bannerDetail',
		component:BannerDetail
	},
	{
		path:'/order',
		name:'order',
		component:Order
	},
	{
		path: '/paymentStatus',
		name:'paymentStatus',
		component:PaymentStatus
	},
	{
		path: '/orderStatus',
		name: 'orderStatus',
		component:OrderStatus
	},
	{
		path: '/userInformation',
		name:'userInformation',
		component:UserInformation
	},
	{
		path: '/manageAddress',
		name:'manageAddress',
		component:ManageAddress
	},
	{
		path: '/addAddress',
		name:'addAddress',
		component:AddAddress
	},
	{
		path: '/searchProduct/:word',
		name:'searchProduct',
		component:SearchProduct
	},
	{
		path: '/flashSale',
		name:'flashSale',
		component:FlashSale
	},
	{
		path: '/waitComments',
		name:'waitComments',
		component:WaitComments
	},
	{
		path:'/comments',
		name:'comments',
		component:Comments,
		meta: {
			keepAlive: true
		}
	},
	{
		path:'/avatar',
		name:'avatar',
		component:Avatar
	}
]

routes.forEach((item)=>{
	if(!item.meta){
		item.meta = {}
		item.meta.hiddeTabBar = true
	}
})

const router = new VueRouter({
	routes,
	mode:'history',
	scrollBehavior(to,from,position) {
		if (position) {
			return position
		}
		else {
			return  {x:0,y:0}
		}
	}
})

export default router
