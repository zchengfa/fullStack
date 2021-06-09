<template>
  <div class="wrapper" ref="slide">
    <div class="content" :class="{padding:padding}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll"
export default {
  name: 'Scroll',
  data(){
    return {
      scroll:null
    }
  },
  props:{
    probeType:{
      type:Number,
      default() {
        return 1;
      }
    },
    pullUpLoad:{
      type:Boolean,
      default() {
        return false;
      }
    },
    padding: {
      type:Boolean,
      default() {
        return false
      }
    }
  },
  mounted() {
    //创建better-scroll
    this.scroll = new BScroll(this.$refs.slide, {
      click:true,
      probeType:this.probeType,
      pullUpLoad:this.pullUpLoad,
      mouseWheel:true
    })

    //判断是否需要开启滚动监听
    if(this.probeType ===2 || this.probeType ===3){
      //监听滚动位置,监听之前需开启probeType：3
      this.scroll.on('scroll', (position)=> {
        //将滚动事件以及position发送给父组件，让父组件对事件作出处理
        this.$emit('scroll', position)
      })
    }

    //判断是否需要开启上拉加载监听
    if(this.pullUpLoad){
      //监听上拉加载，需先开启监听
      this.scroll.on('pullingUp', ()=> {
        //将上拉加载事件发送给父组件，让父组件对事件作出处理
        this.$emit('pullingUp')
      })
    }
  },
  methods:{
    scrollTo(x, y, time=500){
      //先判断scroll是否已经初始化了，防止在没有初始化之前使用方法时产生bug
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp(){
      this.scroll && this.scroll.finishPullUp()
    },
    refresh(){
      this.scroll && this.scroll.refresh()
    }
  }
}
</script>


<style scoped>
.padding {
  padding-bottom: 5rem;
}
</style>
