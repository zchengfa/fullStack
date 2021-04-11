<template>
 <div class="back-top">
   <div class="content">
     <img src="~assets/image/home/backTop/back_top.png" alt="back_image">
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
    position: fixed;
    right: 1rem;
    bottom: 4rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #e2dcdc;
    text-align: center;
    z-index: 10;
  }
  img{
    position: relative;
    top:.5rem
  }
</style>
