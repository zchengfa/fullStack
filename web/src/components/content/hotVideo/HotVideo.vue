<template>
  <Scroll ref="scroll" class="video-content" :probe-type="3">
    <div class="video-item" v-for="(item,index) in dataJson" :key="index">
      <div class="author">{{item.author}}</div>
      <div class="image-cover" v-show="!item.isShowVideoWrapper" @click="playVideo(index,item['share_url'])">
        <img :src="item['item_cover']" @load="itemImageLoad" :alt="item.author">
        <img class="play" :src="play" >
      </div>
<!--      视频资源暂缺，等候完善-->
      <video controls v-show="item.isShowVideoWrapper" :width="coverWidth" :height="coverHeight">
        <source :src="item['share_url']">
      </video>
      <p class="video-des">{{item['title']}}</p>
    </div>
  </Scroll>
</template>

<script>
import {play_button} from 'assets/JSON/data'
import Scroll from "components/common/scroll/Scroll.vue";
import {refreshScrollMixins} from "common/mixins/mixins";
import {getHotVideo} from "network/request";


export default {
  name: "HotVideo",
  mixins:[refreshScrollMixins],
  components:{
    Scroll
  },
  data(){
    return {
      dataJson:null,
      play:null,
      coverHeight:null,
      coverWidth:null
    }
  },
  methods:{
    itemImageLoad(){
      this.$bus.$emit('itemImageLoad')
      if (!this.coverHeight&&!this.coverWidth){
        let coverElHeight = document.querySelectorAll('.image-cover').item(0).clientHeight
        let coverElWidth = document.querySelectorAll('.image-cover').item(0).clientWidth
        this.coverHeight = coverElHeight
        this.coverWidth = coverElWidth
      }
    },
    playVideo(index,url){
      //跳转到第三方查看视频
      window.location.href = url

      //改变数据，控制组件的显示隐藏
      // let data = []
      // data.push(...this.dataJson)
      // data.map((item,videoIndex)=>{
      //   if (videoIndex===index){
      //     item['isShowVideoWrapper'] = true
      //   }
      //   else{
      //     item['isShowVideoWrapper'] = false
      //   }
      // })
      // this.dataJson = data
    }
  },
  created() {
    this.play = play_button
    getHotVideo().then(res=>{
      //由于第三方接口每天的请求次数有限制，需将请求到的数据进行存储，带请求次数上限时，从本地存储中获取数据
      if (res.data.result){
        this.dataJson = res.data.result
        this.dataJson.map(item=>{
          item['isShowVideoWrapper'] = false
        })
        localStorage.setItem('hot_video',JSON.stringify(this.dataJson))
      }
      else{
        this.dataJson = JSON.parse(localStorage.getItem('hot_video'))
      }
    })
  }
}
</script>

<style scoped>
.video-content{
  width: 100%;
  height: calc(100vh - 44px - 6rem);
  overflow: hidden;
}
.video-item{
  position: relative;
  width: 100%;
  margin: 0 auto ;
}
.video-item div{
  padding: 1rem;
}
.video-item .image-cover{
  position: relative;
  background-color: rgba(63, 59, 59, 0.9);
}
.video-item .image-cover img{
  margin: 0 50%;
  transform: translateX(-50%);
}
img.play{
  position: absolute;
  top:50%;
}
.video-item p{
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>