<template>
  <div id="app">
		<main-tab-bar></main-tab-bar>
<!--    使用keep-alive让vue离开当前页面时保持状态，不销毁-->
    <keep-alive exclude="detail">
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>
	import MainTabBar from './components/content/mainTabBar/MainTabBar.vue'
	export default {
		name: 'App',
		components: {
			MainTabBar
		}
	}
</script>
<style scoped>
	@import url("assets/css/normalize.css");
  @import url("assets/css/reset.css");
</style>
