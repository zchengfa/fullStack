<template>
	<div class="nav-bar">
		<div class="top">
      <div class="left">
        <slot name="left"></slot>
      </div>
      <div class="center">
        <slot name="center"></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="bottom">
      <slot name="bottom"></slot>
    </div>
	</div>
</template>

<script>
	export default {
		name:'NavBar'
	}
</script>

<style scoped>
	.nav-bar{
    position: relative;
    z-index: 9;
	}
  .top{
    display: flex;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    overflow: hidden;
  }
	.left,.right{
		min-width: 60px;
		height: 44px;
	}
	.center{
		flex: 1;
		height: 44px;
	}
  .bottom{
    display: block;
    width: 100%;
  }
</style>

