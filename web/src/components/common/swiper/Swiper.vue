<template>
  <div class="swiper">
    <div class="swiper-container">
      <ul class="swiper-list">
        <li v-for="(item, index) in banner" v-show="index===mark" :key="index">
          <div class="item-container">
            <img :src="item.imagePath" alt="itemImage" @load="imageLoad">
          </div>
        </li>
      </ul>
    </div>
    <swiper-item :banner="banner" :mark="mark"></swiper-item>
  </div>
</template>

<script>
  import SwiperItem from "@/components/common/swiper/SwiperItem"

  export default {
    name: "Swiper",
    props:{
      banner:{
        type:Array,
        default:[]
      }
    },
    data(){
      return {
        mark:0,
        isLoad:false
      }
    },
    components:{
      SwiperItem
    },
    methods:{
      play(){
        setInterval(()=>{
          this.mark ++
          if(this.mark==this.banner.length){
            this.mark = 0
          }
        },3000)
      },
      imageLoad(){
        if(!this.isLoad){
          this.$emit('swiperImageLoad')
          this.isLoad = true
        }
      }
    },
    created() {
      this.play()
    }

  }
</script>

<style scoped>
  .swiper{
    position: relative;
    padding-top: 44px;
  }
  ul{
    display: flex;
    width: 100%;
  }
  ul li{
    flex:1;
  }
  img{
    width: 100%;
    height: 10rem;
  }
</style>
