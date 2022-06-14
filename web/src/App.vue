<template>
  <div id="app">
		<main-tab-bar></main-tab-bar>
    <Loading v-loading="$store.state.loading"></Loading>
<!--    使用keep-alive让vue离开当前页面时保持状态，不销毁-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>
<script>
	import MainTabBar from './components/content/mainTabBar/MainTabBar.vue'
  import Loading from './components/common/loading/Loading.vue'

	export default {
		name: 'App',
		components: {
			MainTabBar,
      Loading
		},
    mounted() {
      console.log(this.$toast)
    },
  }
</script>
<style scoped>
	@import url("assets/css/normalize.css");
  @import url("assets/css/reset.css");
  #app{
    position: relative;
    margin: 0;
    width: 100vw;
    height: 100vh;
  }

</style>
