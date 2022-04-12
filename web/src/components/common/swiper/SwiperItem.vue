<template>
  <div class="swiper-item">
    <ul>
      <li v-for="(item, index) in banner" :class="{active:index===mark}" :key="index"></li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "SwiperItem",
    props:{
      banner:{
        type:Array,
        default() {
          return []
        }
      },
      mark:{
        type:Number,
        default: null
      }
    },
    data(){
      return {

      }
    }
  }
</script>

<style scoped>
  .active{
    background-color: #ff69b4;
  }
  .swiper-item{
    position: absolute;
    left: 50%;
    bottom:1.8rem;
    transform: translate(-50%);
  }
  ul{
    display: flex;
  }
  ul li{
    margin-left: .4rem;
    width: .5rem;
    height: .5rem;
    border-radius: .3rem;
    background-color: #dcd2d2;
  }
</style>
