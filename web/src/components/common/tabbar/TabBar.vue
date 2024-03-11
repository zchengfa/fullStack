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
		left: 50%;
    right: 0;
		bottom: 0;
    width: 100%;
    max-width: var(--app-max-width);
		text-align: center;
    transform: translateX(-50%);
		background-color: #eeeeee;
    z-index: 9;
	}
</style>
