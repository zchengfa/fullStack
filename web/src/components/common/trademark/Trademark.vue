<template>
  <div class="trademark-box">
    <span class="trademark">mall</span>
  </div>
</template>

<script>
export default {
  name: "Trademark"
}
</script>

<style scoped>
.trademark-box{
  position: absolute;
  left: 0;
  top:0;
  width:2.8rem;
  height:1.2rem;
  color: #fff;
  background-color: #ff5825;
}
.trademark{
  display: inline-block;
  margin: 0;
  width: 100%;
  height: 100%;
  font-family: "Harlow Solid Italic",serif;
  line-height: 1.2rem;
}
.trademark-box::after{
  position: absolute;
  display: inline-block;
  top: 0;
  left: 2.8rem;
  content: '';
  border-color: #ff5825;
  border-style: solid;
  border-width:.6rem ;
  border-bottom-color: transparent;
  border-top-color: transparent;
  border-right-color: transparent;
}
</style>