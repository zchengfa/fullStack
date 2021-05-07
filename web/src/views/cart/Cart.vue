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
          <check-button class="check" :is-checked="item.isChecked" @click.native="changeChecked(index)"></check-button>
          <div class="shop-info">
            <div class="image-box"><img :src="item.image" alt="cart_image"></div>
            <div class="info">
              <p class="title">{{item.title}}</p>
              <p class="price">{{item.price}}</p>
              <div class="button-box">
                <button class="reduce" :disabled="item.shopCount <= 1" @click="reduceCount(index)">-</button>
                <span class="quantity">{{item.shopCount}}</span>
                <button class="add" @click="addCount(index)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="login-tip" v-if="isLogin">
        <span>您还未登录</span>
        <router-link class="to-login" :to="{path:'/login'}">马上登录</router-link>
      </div>
    </Scroll>

    <settle-cart v-show="cartList.length"></settle-cart>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar"
  import Scroll from "@/components/common/scroll/Scroll"

  import CheckButton from "@/views/cart/components/CheckButton"
  import SettleCart from "@/views/cart/components/SettleCart";

  export  default {
    name:'Cart',
    data(){
      return {
        cartList: this.$store.state.cartList,
        isLogin:false
      }
    },
    components:{
      NavBar,
      Scroll,
      CheckButton,
      SettleCart
    },
    methods:{
      //减少数量
      reduceCount(index){
        //减少对应商品的数量
        this.cartList[index].shopCount --
      },
      //增加数量
      addCount(index){
         //增加对应商品的数量
         this.cartList[index].shopCount ++
      },
      changeChecked(index){
        this.cartList[index].isChecked = !this.cartList[index].isChecked
      }
    },
   activated() {
     if (this.$refs.scroll){
       //进入页面时刷新scroll
       this.$refs.scroll.scroll.refresh()
     }
     //判断用户是否登录,若已登录显示用户的购物车物品列表,未登录，显示登录提示
     if (sessionStorage.getItem('token')){
       this.isLogin = false
       if (this.cartList.length ===0) {
         this.$empty.showEmpty('您的购物车空空如也...')
       }
     }
     else {
       this.isLogin = true
     }
   },
    deactivated() {
      //离开页面，隐藏empty
      this.$empty.removeEmpty()
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
    height: 2rem;
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
    width: 10rem;
    height: 1.5rem;
    margin-left: .3rem;
    background-color: #1e8efc;
    border-radius: 1rem;
    color: #fff;
    text-align: center;
  }
  .cart{

  }
  .cart-item{
    display: flex;
    margin:1rem auto;
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
</style>
