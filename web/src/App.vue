<template>
  <div id="app">
    <main-tab-bar v-if="!$route.meta.hiddeTabBar"></main-tab-bar>
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
		}
  }
</script>
<style >
	@import url("assets/css/normalize.css");
  @import url("assets/css/reset.css");
  #app{
    position: relative;
    margin: 0 auto;
    width: 100vw;
    height: 100vh;
    max-width: var(--app-max-width);
    scroll-behavior: smooth;
  }

  :root{
    --app-max-width:500px
  }
  .nav-bar .left img{
    transform: scale(.8);
  }
  .back{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
