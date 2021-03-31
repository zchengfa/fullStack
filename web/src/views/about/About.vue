<template>
	<div class="about">
    <Scroll class="content">
      <div class="test"></div>
      <div class="test"></div>
      <div class="test"></div>
      <div class="test"></div>
      <div class="test"></div>
      <div class="test"></div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll"
export default {
  name:"About",
  components:{
    Scroll
  }
}
</script>

<style scoped>
.about{
  position: relative;
  height: 100vh;
}
.content{
  height: 100%;
  overflow: hidden;
}
.test{
  background-color: red;
  width: 100%;
  height: 300px;
  margin-top: 30px;
}
</style>
