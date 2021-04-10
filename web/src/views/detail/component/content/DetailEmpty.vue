<template>
  <div class="message">
    <div class="err-image"><img src="~assets/image/home/errDetail/no_data.png" alt="err"></div>
    <div class="err-message">没有数据哦！</div>
  </div>
</template>

<script>
export default {
  name: "DetailEmpty"
}
</script>

<style scoped>
.message{
  text-align: center;
}
.err-image{
  width: 100%;
  background-size: contain;
}
</style>