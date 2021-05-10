<template>
	<div class="nav-cart">
    <nav-bar>
      <div slot="center">
        <div class="nav-title">购物车({{cartList.length}})</div>
      </div>
    </nav-bar>
    <Scroll class="content" ref="scroll">
      <div class="cart" v-if="cartList.length">
        <div class="cart-item" v-for="(item,index) in cartList" :key="index">
          <check-button class="check" :is-checked="Boolean(item.isChecked)" @click.native="changeChecked(index)"></check-button>
          <div class="shop-info">
            <div class="image-box"><img :src="item.product_image" alt="cart_image"></div>
            <div class="info">
              <p class="title">{{item.product_title}}</p>
              <p class="price">{{item.product_price}}</p>
              <div class="button-box">
                <button class="reduce" :disabled="item.product_count <= 1" @click="reduceCount(index)">-</button>
                <span class="quantity">{{item.product_count}}</span>
                <button class="add" @click="addCount(index)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Empty v-else-if="!cartList.length && !isLogin" :empty-message="emptyMessage"></Empty>
      <div class="login-tip" v-if="isLogin">
        <span>您还未登录</span>
        <router-link class="to-login" :to="{path:'/login'}">马上登录</router-link>
      </div>
      <div class="recommend">
        <div class="title">
          <h3>
            <img src="~assets/image/cart/balloon.svg" alt="balloon">
            为你推荐
            <img src="~assets/image/cart/balloon.svg" alt="balloon">
          </h3>
        </div>
        <goods-data v-if="recommendData.length" :goods="recommendData"></goods-data>
      </div>
    </Scroll>

    <settle-cart :cart-list="cartList" v-show="cartList.length"></settle-cart>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar"
  import Scroll from "@/components/common/scroll/Scroll"
  import Empty from "@/components/common/empty/Empty";

  import CheckButton from "@/views/cart/components/CheckButton"
  import SettleCart from "@/views/cart/components/SettleCart";

  import GoodsData from "@/components/content/goodsData/GoodsData";

  import {getRecommendData,getUserCartData,updateChecked,updateProductCount} from "@/network/cart";

  export  default {
    name:'Cart',
    data(){
      return {
        cartList: [],
        user_id:'',
        isLogin:false,
        recommendData:[],
        emptyMessage: '',
        emptyRecommend:''
      }
    },
    components:{
      NavBar,
      Scroll,
      CheckButton,
      SettleCart,
      GoodsData,
      Empty
    },
    methods:{
      //减少用户所点击的商品数量函数
      reduceCount(index){
        //减少对应商品的数量
        this.cartList[index].product_count --

        //提交减少该产品的数量的请求
        updateProductCount(this.user_id,this.cartList[index].product_id,this.cartList[index].product_count).then()
        console.log(index,this.cartList[index])
      },
      //增加用户所点击的商品数量函数
      addCount(index){
         //增加对应商品的数量
         this.cartList[index].product_count ++

        //提交增加该产品的数量的请求
        updateProductCount(this.user_id,this.cartList[index].product_id,this.cartList[index].product_count).then()
        console.log(index,this.cartList[index])
      },
      changeChecked(index){
        //点击选中按钮，修改按钮状态，并将修改后的状态提交到后端
        this.cartList[index].isChecked = !this.cartList[index].isChecked

        //提交更新请求
        updateChecked(this.user_id, this.cartList[index].product_id, this.cartList[index].isChecked).then()

      },
      //获取商品推荐数据函数
      getRecommendData(){
        getRecommendData().then(res => {
          //console.log(res)
          if (res.data.empty) {
            this.emptyRecommend = res.data.empty
          }
        })
      },
      //获取用户购物车数据函数
      getUserCartData (token) {
        getUserCartData(token).then(res => {
          //清空之前的数据
          this.cartList = []
          //判断是否存在用户购物车数据
          if(res.data.user_cart_data) {
            //获取user_id
            this.user_id = res.data.user_cart_data[1].user_id

            //遍历数组
            res.data.user_cart_data[0].map((item) => {
              //提取数据中的购物车数据
              this.cartList.push(item)
            })
          }
          else {
            this.emptyMessage = res.data.empty
          }
        })
      }
    },
    mounted() {

    },
    activated() {
      if (this.$refs.scroll){
        //进入页面时刷新scroll
        this.$refs.scroll.scroll.refresh()
      }
     //判断用户是否登录,若已登录显示用户的购物车物品列表,未登录，显示登录提示
     const  token = sessionStorage.getItem('token')
     if (token){
       this.isLogin = false

       //存在token值，用户已登录，执行获取用户购物车数据函数
       //进入购物车页面，获取用户token，执行获取用户购物车数据函数
       this.getUserCartData(token)
     }
     else {
       this.isLogin = true
     }
     //进入购物车页面，执行获取商品推荐数据函数
     this.getRecommendData()

   }
  }
</script>

<style scoped>
  .nav-cart{
    height: 100vh;
  }
  .nav-bar{
    background-color: #db7093;
  }
  .nav-title{
    color: #fff;
  }
  .content{
    height: calc(100% - 98px);
    overflow: hidden;
    background-color: #fff;
  }
  .login-tip{
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
    width: 50%;
    line-height: 1.5rem;
  }
  .login-tip span{
    display: inline-block;
    width: 100%;
    text-align: center;
    color: #a5a2a2;
  }
  .to-login{
    display: block;
    margin: .5rem auto;
    width: 5rem;
    height: 1.5rem;

    background-color: #fff;
    border: 1px solid #a5a2a2;
    border-radius: 1rem;
    font-size: .5rem;
    text-align: center;
  }
  .cart{

  }
  .cart-item{
    display: flex;
    margin:0 auto 1rem;
    width: 96vw;
  }
  .check{
    flex: 1;
  }
  .shop-info{
    display: flex;
    flex: 8;
  }
  .title{
    font-size: .8rem;
  }
  .image-box{
    flex: 1;
    padding: 0 1rem 0 0;
  }
  .image-box img{
    position: relative;
    top:1rem
  }
  .info{
    flex: 3;
  }
  .image-box img{
    width: 5rem;
    height: 6rem;
  }
  .price{
    color: #e02929;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .button-box{
    position: relative;
    left: 60%;
    width: 40%;
  }
  .button-box button{
    width: 1.6rem;
    height: 1.6rem;
    font-weight: bold;
  }
  .button-box span{
    padding: 0 .5rem;
  }
  .recommend{
    margin: 1rem auto;
    width: 94%;
    text-align: center;
  }
  .recommend h3 {
    height: 2.2rem;
  }
  img[alt='balloon'] {
    position: relative;
    top:.5rem;
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
