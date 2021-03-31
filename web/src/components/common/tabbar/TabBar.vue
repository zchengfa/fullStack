<template>
	<div id="tab-bar">
		<slot></slot>
	</div>
</template>

<script>

	export default {
		name:"TabBar",
		components:{
}

		}
</script>

<style scoped>
	#tab-bar{
		display: flex;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		text-align: center;
		background-color: #eeeeee;
    z-index: 9;
	}
</style>
