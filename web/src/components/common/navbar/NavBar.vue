<template>
	<div class="nav-bar">
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
</template>

<script>
	export default {
		name:'NavBar',
		components:{

		}
	}
</script>

<style scoped>
	.nav-bar{
    position: relative;
		display: flex;
    width: 100%;
		height: 44px;
		line-height: 44px;
		text-align: center;
    z-index: 9;
	}
	.left,.right{
		width: 60px;
		height: 44px;
	}
	.center{
		flex: 1;
		height: 44px;
	}
</style>

