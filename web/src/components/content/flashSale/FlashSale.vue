<template>
<div class="flash-sale">
  <nav-bar class="nav">
    <div slot="left" @click="goBack">
      <img src="~assets/image/detail/back.svg" alt="back_icon">
    </div>
    <div slot="center">mall秒杀</div>
  </nav-bar>
  <Scroll ref="scroll" class="content">
    <div class="flash-hour-list">
      <ul class="list-item">
        <li v-for="(item,index) in flashHourList" :key="index" @click="getCurrentFlashSale(item,index)">
          <button :class="{'active':currentIndex===index}">{{item}}</button>
          <span v-show="nowFlashHour+':00'===item" :class="{'active':currentIndex===index}">抢购中</span>
          <span v-show="nowFlashHour+':00'!==item" :class="{'active':currentIndex===index}">即将开抢</span>
        </li>
      </ul>
    </div>
    <div class="sale-goods">
      <div v-for="(sale,saleIndex) in flashSaleData" :key="saleIndex" class="goods-item" @click="detail(sale['product_id'],sale['product_type'],sale['sell_type'],saleIndex)">
        <div class="image-box">
          <img :src="sale['product_image']" @load="imageLoadOver" alt="product_image">
        </div>
        <div class="info">
          <p>{{sale['product_title']}}</p>
          <div class="price-purchase">
            <div class="price"><span><span class="character">￥</span>{{sale['price']}}</span></div>
            <div class="rush-purchase">
              去抢购
              <span class="progress"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Scroll>
</div>
</template>

<script>
import {backPreviousPageMixins} from "@/common/mixins/mixins";
import NavBar from "@/components/common/navbar/NavBar.vue";
import Scroll from "@/components/common/scroll/Scroll.vue";
import {getFlashSaleData} from "@/network/home";
import {debounce} from "@/common/utils";

export default {
  name: "FlashSale",
  mixins:[backPreviousPageMixins],
  components:{
    NavBar,
    Scroll
  },
  data(){
    return {
      nowFlashHour:null,
      flashHourList:[],
      currentIndex:0,
      flashSaleData:[]
    }
  },
  methods:{
    getCurrentFlashSale(item,index){
      this.currentIndex = index
      let hour = Number(item.substring((item.length-3),0))
      this.getFlashSaleD(hour)
    },
    getFlashSaleD(hour){
      getFlashSaleData(hour,40).then(res=>{
        this.flashSaleData = []
        this.flashSaleData.push(...res.data)

        //将点击的商品排在列表最前面
        let pro_id = this.$route.query.product_id
        this.flashSaleData.map((item,index)=>{
          if (item.product_id === pro_id){
            if (index !==0){
              let pro = this.flashSaleData.splice(index)
              this.flashSaleData.unshift(...pro)
            }
          }
        })
      })
    },
    detail(product_id,product_type,sell_type,id){
      this.$router.push('/detail/'+sell_type+'/'+product_type +'/'+(product_id)+'/'+id)
    },
    imageLoadOver(){
      //图片加载完后刷新scroll组件
      debounce(()=>{
        this.$refs.scroll.scroll.refresh()
      },300)()

    }
  },
  created() {
    let nowHour = new Date().getHours()
    nowHour%2===0?this.nowFlashHour = nowHour:this.nowFlashHour = nowHour - 1

    //生成抢购时间表
    for (let i = 0; i < 5; i++) {
      if (this.nowFlashHour+i*2>24){
        this.flashHourList.push((this.nowFlashHour+i*2)-24 +':00')
      }
      else {
        this.flashHourList.push(this.nowFlashHour+i*2 +':00')
      }
    }

    this.getFlashSaleD(this.nowFlashHour)
  }
}
</script>

<style scoped>
.active{
  font-size: 1.1rem;
  font-weight: bold;
  color: #fd001e;
}
span.active{
  color: #FFFFFF;
  background-color: #fd001e;
}
.flash-sale{
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #f1eded;
  z-index: 11;
}
.nav{
  background-color: #FFFFFF;
}
.nav div{
  height: 100%;
  overflow: hidden;
}
.nav div img{
  position: relative;
  margin-top:25%;
  transform: translateY(-25%);
}
.content{
  width: 100%;
  height: calc(100% - 44px);
  overflow: hidden;
}
.flash-hour-list{
  padding-top: .5rem;
  padding-bottom: .5rem;
  width: 100%;
  height: 4rem;
  background-color: #d3cbcc;
}
.flash-hour-list ul{
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: scroll;
}
.flash-hour-list ul::-webkit-scrollbar{
  display: none;
}
.flash-hour-list ul li{
  flex: 1;
  flex-wrap: nowrap;
  text-align: center;
}
.flash-hour-list li button{
  width: 100%;
  height: 50%;
}
.flash-hour-list li span{
  display: inline-block;
  padding: .2rem .5rem;
  text-align: center;
  font-size: .8rem;
  border-radius: 1rem;
}
.goods-item{
  display: flex;
  align-items: center;
  justify-items: center;
  margin: .5rem auto;
  padding: 1rem .5rem;
  width: 94%;
  background-color: #FFFFFF;
  border-radius: .5rem;
}
.goods-item .image-box img{
  width: 8rem;
}
.info{
  margin: 0 auto;
  width: calc(100% - 8rem - .5rem);
}
.info .character{
  font-size: 12px;
}
.info span{
  color: #fd001e;
  font-size: 1.2rem;
  font-weight: bold;
}
.info .price-purchase::after{
  display: block;
  content: '';
  height: 0;
  clear: both;
  visibility: hidden;
}
.info .price-purchase .price{
  float: left;
}
.info .price-purchase .rush-purchase{
  margin-right: .5rem;
  float: right;
  width: 6rem;
  height: 3rem;
  background-color: #fd001e;
  border-radius: .5rem;
  text-align: center;
  line-height: 2rem;
  color: #FFFFFF;
}
.rush-purchase span {
  position: relative;
  top: -1rem;
  display: inline-block;
  width: 60%;
  height: .3rem;
  background-color: #FFFFFF;
  border-radius: 1rem;
}
</style>