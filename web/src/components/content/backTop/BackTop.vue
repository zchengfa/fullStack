<template>
 <div class="back-top">
   <div class="back-top-box">
     <div class="arrow"></div>
   </div>
 </div>
</template>

<script>
export default {
name: "BackTop"
}
</script>

<style scoped>
.back-top{
  position: absolute;
  right: 10px;
  bottom:60px;
  width: 60px;
  height: 60px;
  background-color: white;
  border-radius: 50%;
  z-index: 9;
}
.back-top-box{
  position: relative;
}
.arrow{
  position: absolute;
  top:15px;
  left: 50%;
  width: 4px;
  height: 30px;
  transform: translateX(-50%);

  background-color: orange;
}
.arrow::before{
  position: absolute;
  top:-4px;
  left: -4px;
  content: "";
  border-width: 0 6px 10px;
  border-color: transparent transparent orange;
  border-style: solid;
}
</style>
