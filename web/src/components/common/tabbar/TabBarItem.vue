<template>
	<div class="tab-bar-item" @click="itemClick">
		<div v-if="!isActive"><slot name="item-icon"><img src="" alt=""></slot></div>
		<div v-else><slot name="item-icon-active"><img src="" alt=""></slot></div>
		<!-- 动态绑定样式修改文本颜色 -->
		<div :style="activeStyle"><slot name="item-text">首页</slot></div>
	</div>
</template>

<script>
	
	export default {
		name:"TabBarItem",
		//props属性接收父组件传入的path和activeColor
		props:{
			path:String,
			activeColor:{
				type:String,
				//默认为红色
				default:'#ff0000'
			}
		},
		methods:{
			//实现item点击方法，使用路由跳转到指定路径
			itemClick(){
				this.$router.push({path:this.path})
			}
		},
		computed:{
			isActive(){
				//返回布尔值(判断当前活跃的路径是否与该item路径一致，一致返回true，不一致返回false)
				return this.$route.path.indexOf(this.path) !== -1
			},
			//通过计算属性判断当前item是否处于活跃状态，处于活跃则返回activeColor的值来改变文本的颜色
			activeStyle(){
				return this.isActive ? {color:this.activeColor}:{}
			}
		},
	}
</script>

<style scoped>
	.tab-bar-item{
		margin-top: 6px;
		flex: 1;
		font-size: 14px;
		
	}
	.tab-bar-item img{
		width: 24px;
		height: 24px;
	}
</style>
