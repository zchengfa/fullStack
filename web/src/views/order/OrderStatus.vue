<template>
<div class="order-status">
  <nav-bar class="nav">
    <div @click="goBack" class="back" slot="left"><img src="~assets/image/detail/back.svg" alt="backImage"> </div>
    <div slot="center" class="input-box">
      <img :src="search_icon" alt="search_icon">
      <input type="text" placeholder="搜索我的订单">
    </div>
    <div slot="bottom" class="status-menu">
      <div v-for="(item,index) in status_menu" :key="index">
        <button @click="showGoods(index)" :class="{active:currentIndex===index}">{{item}}</button>
        <img v-if="currentIndex===index" :src="arc_icon" alt="arc_icon">
      </div>
    </div>
  </nav-bar>
  <Scroll class="content" ref="scroll">
    <div v-show="userAllOrderData.length" v-for="(item,index) in userAllOrderData" :key="index" class="order-item">
      <div class="title clearfix">
        <span class="store-name"></span>
        <span class="payment-status" v-if="item['payment_status']===0">待付款</span>
        <span class="payment-status" v-if="item['payment_status']===1">待收货</span>
        <span class="payment-status" v-if="item['payment_status']===2">已完成</span>
        <span class="payment-status" v-if="item['payment_status']===4">已取消</span>
      </div>
      <div class="order-info clearfix">
        <div class="image-box">
          <div class="image-item" v-for="(image,imgIndex) in item['product_image']" :key="imgIndex">
            <img :src="image" alt="product_image" @load="imageLoadOver">
          </div>
        </div>
        <div  class="total-price-num">
          <span class="character">￥</span>
          <span>{{item['total_price']}}</span>
          <p class="total-num">共{{item['total_num']}}件</p>
        </div>
      </div>
      <div class="order-operation">
        <button>再次购买</button>
        <button>删除订单</button>
        <button>退换/售后</button>
      </div>
    </div>
    <Recommend class="recommend" :align-center="true" :recommend-data="recommendData" recommend-title="为你推荐"></Recommend>
  </Scroll>
</div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar.vue";
import Scroll from "@/components/common/scroll/Scroll.vue";
import {backPreviousPageMixins,recommendMixins} from "@/common/mixins/mixins";
import base64 from '@/assets/image/base64/base64'
import {getUserAllOrder} from "@/network/home";
import Recommend from "@/components/content/recommend/Recommend.vue";

export default {
  name: "OrderStatus",
  mixins:[backPreviousPageMixins,recommendMixins],
  data(){
    return {
      search_icon:null,
      arc_icon:null,
      status_menu:['全部','待付款','待收货','已完成','已取消'],
      currentIndex:0,
      userAllOrderData:[]
    }
  },
  components:{
    NavBar,
    Scroll,
    Recommend
  },
  methods:{
    showGoods(index){
      this.currentIndex = index
    },
    getAllOrder(){
      getUserAllOrder(this.$store.state.userInfo.user_id).then(res=>{
        res.data.length?this.userAllOrderData.push(...res.data):null
      })
    },
    imageLoadOver(){
      this.$refs.scroll.scroll.refresh()
    }
  },
  created() {
    this.search_icon = base64['search']['search_icon']
    this.arc_icon = base64['circle_arc']
    this.getAllOrder()
    if (this.$store.state.token){
      let userInfo = this.$store.state.userInfo
      this.user_id = userInfo.user_id
      //当用户的订单数量不超过5条时获取用户对应的推荐数据
      this.userAllOrderData.length<=5?this.getUserRecommend(this.user_id):null

    }
    else {
      //token值不存在，用户未登录，当用户的订单数量不超过5条时获取默认的推荐数据
      this.userAllOrderData.length<=5?this.getCommonRecommend():null
    }
  }
}
</script>

<style scoped>
.clearfix::after{
  display: block;
  content: '';
  height: 0;
  clear: both;
  visibility: hidden;
}
.active{
  color: red;
}
.order-status{
  position: relative;
  height: 100vh;
  background-color: #f3ecec;
  overflow: hidden;
}
.nav{
  position: relative;
  background-color: #f3ecec;
  z-index: 12;
}
.back{
  height: 100%;
}
.back img{
  position: relative;
  margin-top: 25%;
  transform: translateY(-25%);
}
input{
  width: 100%;
  height:2rem;
  border-radius: 1rem;
  text-indent: 2rem;
}
.input-box{
  position: relative;
}
.input-box img{
  position: absolute;
  top:50%;
  left: .4rem;
  width: 1.6rem;
  transform: translateY(-50%);
}
.status-menu{
  display: flex;
  justify-items: center;
  align-items: center;
  width: 100%;
}
.status-menu div{
  width: 20%;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
}
.status-menu img {
  position: absolute;
  width: 1rem;
  top:74%;
  margin-left:-.8rem;
  animation: arc 1s 1 ease;
}
.content{
  position: relative;
  width: 100vw;
  height: calc(100vh - 44px - 3rem);
  background-color: #f6f3f3;
  z-index: 11;
}
@keyframes arc {
  from{
    width: 0;
    height: 0;
  }
  to{
    width: 1rem;
  }
}
/*订单列表样式*/
.order-item{
  margin: 1rem auto;
  width: 94%;
  background-color: #FFFFFF;
  border-radius: .5rem;
}
.title .store-name{
  float: left;
}
.title{
  padding-top: .5rem;
  padding-bottom: .5rem;
}
.title span{
  float: right;
  margin-right: 1rem;
  background-color: #fff;
}
.title span:last-child{
  color: #8a8686;
  font-size: .9rem;
}
.order-info .image-box{
  float: left;
}
.order-info .total-price-num{
  float: right;
}
.image-box{
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
}
.image-box div{
  margin-left: 3px;
  display: inline-block;
}
.image-box img{
  margin: 0 auto;
  width: 5rem;
  border-radius: .5rem;
}
.total-price-num{
  position: relative;
  top: 1rem;
  margin-right: 1rem;
}
.total-price-num .character{
  font-size: 12px;
}

.total-price-num p{
  margin-bottom: 0;
  font-size: 12px;
  color: #8a8686;
  text-align: center;
}
.order-operation{
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
}
.order-operation button{
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
  height: 1.6rem;
  border-radius: .8rem;
  font-size: .8rem;
  border: 1px solid #8a8686;
  color: #4d4b4b;
}
.order-operation button:first-child{
  color: #fd001e;
  border: 1px solid #fd001e;
}
.recommend{
  padding-bottom: 3rem;
}
</style>