<template>
  <div class="search-component">
    <div class="search-box">
      <slot name="search_icon">
        <div class="search-icon">
          <img :src="search_icon" alt="search_icon">
        </div>
      </slot>
      <slot name="search">
        <div class="search-content">
          <div class="swiper-word" v-for="(item,index) in search_word" :key="index"  v-show="currentWordIndex===index">
<!--            放入几个搜索词定时切换显示-->
            <button @click="toSearch(item)">{{item}}</button>
          </div>
        </div>
      </slot>
      <slot name="take_photo">
        <div class="take-photo">
          <img :src="take_photo_icon" alt="take_photo_icon">
        </div>
      </slot>
      <slot name="qrcode">
        <div class="qr-code">
          <img :src="qrcode_icon" alt="qrcode_icon">
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import base64 from '@/assets/image/base64/base64'
import {getHotSearch} from "@/network/homeContent";
export default {
  name: "search",
  data(){
    return {
      search_icon:null,
      take_photo_icon:null,
      qrcode_icon:null,
      search_word:[],
      currentWordIndex:0
    }
  },
	methods:{
		toSearch(word){
			this.$router.push('/searchProduct/'+word)
		},
    getHotSearch(){
		  getHotSearch().then(res=>{
        res.data.length?(function (word){
          res.data.map(item =>{
            word.push(item['word'])
          })
        })(this.search_word):this.search_word = ['核酸上门检测','儿童水杯','裙子','鞋子']
      })
    }
	},
  created() {
    this.search_icon = base64['search']['search_icon']
    this.take_photo_icon = base64['take_photo']['take_photo_icon']
    this.qrcode_icon = base64['qrcode']
    this.getHotSearch()
  },
  mounted() {
    setInterval(()=>{
      this.currentWordIndex ++
      if (this.currentWordIndex===this.search_word.length){
        this.currentWordIndex = 0
      }
    },5000)
  }
}
</script>

<style scoped>
.search-component{
  margin: 0 auto;
  width: 94%;
  height: 2.4rem;
	min-width: 240px;
	max-width: 390px;
  background-color: #f3ecec;
  border-radius: 1.2rem;
  overflow: hidden;
}
.search-box{
  display: flex;
  align-items: center;
  justify-items: center;
  width: 100%;
  height: 100%;
}
.search-box div{
  flex: 1;
  display: flex;
  align-items: center;
  justify-items: center;
  text-align: center;
	padding:0 .4rem;
}
.search-box div.search-content{
  position: relative;
  margin-left: -1rem;
  flex: 6;
	height: 2rem;
  color: #756c6c;
}
.search-box div:first-child{
  margin-left: .5rem;
}
.search-content .swiper-word{
  position: absolute;
  
	width: 100%;
	height: 2rem;
	font-size: .8rem;
}
.search-content .swiper-word button{
  width:100%;
  height: 2rem;
  line-height: 2rem;
	text-align: left;
}
.search-content{
  width: 70%;
}
img{
  width: 1.6rem;
}
.qr-code::before{
  display: block;
  margin-right: .5rem;
  content: "";
  height: 1rem;
  border-left: 1px solid #fd001e;
 }
</style>