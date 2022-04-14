<template>
<div class="loading">
  <div class="loader">
    <div class="loader-child"></div>
  </div>
  <span>加载中...</span>
</div>
</template>

<script>
export default {
  name: "loading"
}
</script>

<style scoped>
.loading{
  position: absolute;
  top:50%;
  left: 50%;
  background-color: transparent;
  transform: translateX(-50%) translateY(-50%);
  z-index: 999;
}
.loader{
  position: relative;
  margin: 0  auto;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: .15rem solid transparent;
  border-top-color: #1366e1;
  border-bottom-color: #c71313;
  animation: circle 1.5s infinite linear;
}
.loader-child{
  position: absolute;
  width: .5rem;
  height: .5rem;
  top:50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 50%;
  background-color: #fff;
}
span{
  font-size: .9rem;
  color: #fff;
}
@keyframes circle {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>