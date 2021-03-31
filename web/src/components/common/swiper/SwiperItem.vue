<template>
  <div class="swiper-item">
    <ul>
      <li v-for="(item, index) in banner" :class="{'active':index===mark}" :key="index"></li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "SwiperItem",
    props:{
      banner:{
        type:Array,
        default:[]
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
    bottom:.8rem;
    transform: translate(-50%);
  }
  ul{
    display: flex;
  }
  ul li{
    margin-left: .4rem;
    flex: 1;
    width: .6rem;
    height: .6rem;
    border-radius: .3rem;
    background-color: #dcd2d2;
  }
</style>
