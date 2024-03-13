<template>
	<div class="nav-bar">
		<div class="top">
      <div class="left top-item">
        <slot name="left"></slot>
      </div>
      <div class="center top-item">
        <slot name="center"></slot>
      </div>
      <div class="right top-item">
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
  width: 100%;
  z-index: 99;
}
	.top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 44px;
  }
  .top-item{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .top-item.center{
    flex: 1;
    height: 100%;
  }
  .left,.right{
    width: 44px;
    height: 44px;
  }
  .bottom{
    display: block;
    width: 100%;
  }
</style>

