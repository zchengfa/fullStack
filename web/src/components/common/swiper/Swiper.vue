<template>
  <div class="swiper">
    <div class="swiper-container">
      <ul class="swiper-list">
        <li v-for="(item, index) in banner" v-show="index===mark" :key="index">
          <router-link :to="{name:'bannerDetail',query:{brand_id:item.brand_id,brand:item.brand,banner_image:item.banner_image}}" class="item">
            <img :src="item.banner_image" alt="itemImage" @load="imageLoad">
          </router-link>
        </li>
      </ul>
    </div>
    <swiper-item :banner="banner" :mark="mark"></swiper-item>
    <button class="previous" @click="previousPage(mark)"><img src="~assets/image/swiper/previous.png" alt="previous"></button>
    <button class="next" @click="nextPage(mark)"><img src="~assets/image/swiper/next.png" alt="previous"></button>
  </div>
</template>

<script>
  import SwiperItem from "@/components/common/swiper/SwiperItem"

  export default {
    name: "Swiper",
    props:{
      banner:{
        type:Array,
        default() {
          return []
        }
      }
    },
    data(){
      return {
        mark:0,
        timer:null
      }
    },
    components:{
      SwiperItem
    },
    methods:{
      play(){
        this.timer = setInterval(()=>{
          if (this.banner) {
            this.mark = this.mark +1
            if(this.mark === this.banner.length){
              this.mark = 0
            }
          }
        },3000)
      },
      imageLoad(){
        this.$emit('swiperImageLoad')
      },
      //点击按钮显示上一张图片
      previousPage(mark) {
        //点击按钮时暂停自动轮播
        clearInterval(this.timer)

        if (this.mark <= 0) {
          this.mark = this.banner.length
        }
        //点击按钮让mark减一，实现显示上一张图片功能
        this.mark = this.mark -1
        //设置定时器，设定过一段时间没有点击按钮则再次开启自动轮播
        setTimeout(() => {
          this.play()
        },1000)
        console.log('previous',mark)
      },
      //点击按钮显示下一张图片
      nextPage(mark) {
        //点击按钮时暂停自动轮播
        clearInterval(this.timer)

        this.mark = this.mark +1

        if (this.mark >= this.banner.length) {
          this.mark =0
        }

        setTimeout(() => {
          this.play()
        },1000)
        console.log('next',mark)
      }
    },
    mounted() {
      this.play()

    }
  }
</script>

<style scoped>
  .swiper{
    position: relative;
  }
  ul{
    display: flex;
    width: 100%;
  }
  ul li{
    flex:1;
  }
  .item{
    display: block;
    width: 100%;
  }
  .item img{
    width: 100%;
  }
   .previous,.next{
    position: absolute;
    top:50%;
  }
  .previous {
    transform: translateY(-50%);
    left: 0;
  }
  .next {

    left: 100%;
    transform: translateX(-100%) translateY(-50%);
  }
  button img {
    width: 2rem;
    height: 2rem;
  }
</style>
