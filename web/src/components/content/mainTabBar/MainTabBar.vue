<template>
	<tab-bar>
		<!-- 向tabbaritem传入路径和颜色 -->
		<tab-bar-item path="/home">
			<img slot="item-icon" src="~assets/image/home/icon_home.svg" alt="">
			<img slot="item-icon-active" src="~assets/image/home/icon_home_active.svg" alt="">
			<div slot="item-text">首页</div>
		</tab-bar-item>
		<tab-bar-item path="/category">
			<img slot="item-icon" src="~assets/image/category/icon_category.svg" alt="">
			<img slot="item-icon-active" src="~assets/image/category/icon_category_active.svg" alt="">
			<div slot="item-text">分类</div>
		</tab-bar-item>
		<tab-bar-item path="/cart">
			<img slot="item-icon" src="~assets/image/cart/icon_cart.svg" alt="">
			<img slot="item-icon-active" src="~assets/image/cart/icon_cart_active.svg" alt="">
			<div slot="item-text">购物车</div>
		</tab-bar-item>
		<tab-bar-item path="/profile">
			<img slot="item-icon" src="~assets/image/profile/icon_profile.svg" alt="">
			<img slot="item-icon-active" src="~assets/image/profile/icon_profile_active.svg" alt="">
			<div slot="item-text">我的</div>
		</tab-bar-item>
	</tab-bar>
</template>

<script>
	//引入组件
	import TabBar from '../../common/tabbar/TabBar.vue'
	import TabBarItem from '../../common/tabbar/TabBarItem.vue'

	export default{
		name:"MainTabBar",
		components:{
			TabBar,
			TabBarItem
		}
	}
</script>

<style>
</style>
