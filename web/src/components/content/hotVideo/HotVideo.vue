<template>
  <Scroll ref="scroll" class="video-content" :probe-type="3">
    <div class="video-item" v-for="(item,index) in dataJson" :key="index">
      <div class="author">{{item.author}}</div>
      <div class="image-cover" v-show="!item.isShowVideoWrapper" @click="playVideo(index)">
        <img :src="item['item_cover']" @load="itemImageLoad" :alt="item.author">
        <img class="play" :src="play" >
      </div>
      <video controls v-show="item.isShowVideoWrapper" :width="coverWidth" :height="coverHeight">
        <source :src="item['share_url']">
      </video>
      <p class="video-des">{{item['title']}}</p>
    </div>
  </Scroll>
</template>

<script>
import hotVideoData from 'assets/JSON/hot_video'
import {play_button} from 'assets/JSON/data'
import Scroll from "components/common/scroll/Scroll.vue";
import {refreshScrollMixins} from "common/mixins/mixins";

import axios from "axios";

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
    playVideo(index){
      let data = []
      data.push(...this.dataJson)
      data.map((item,videoIndex)=>{
        if (videoIndex===index){
          item['isShowVideoWrapper'] = true
        }
        else{
          item['isShowVideoWrapper'] = false
        }
      })
      this.dataJson = data
    }
  },
  created() {
    this.play = play_button
    // this.dataJson = hotVideoData['result']
    // this.dataJson.map(item=>{
    //   item['isShowVideoWrapper'] = false
    // })
    axios.get('/api/billboard?type=hot_video&key=6045739589f45edbd9ef1c67c581f33a&size=50').then(res=>{
      console.log(res.data.result)
      this.dataJson = res.data.result
      this.dataJson.map(item=>{
        item['isShowVideoWrapper'] = false
      })
    })

  },
  mounted() {

  }
}
</script>

<style scoped>
.video-content{
  width: 100vw;
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