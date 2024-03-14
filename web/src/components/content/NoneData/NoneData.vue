<script>
export default {
  name: "NoneData"
}
</script>

<template>
  <div class="none">
    <img src="~assets/image/none.png" alt="none">
    <span class="none-msg">暂未获取到数据！</span>
  </div>
</template>

<style scoped>
.none{
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translate(-50%,-50%);
  z-index: 10;
}
.none-msg{
  margin-top: 1.5rem;
  color: #8a8a8a;
  font-size: 14px;
}
</style>