<template>
	<div class="nav-cart">
    <nav-bar>
      <div slot="center">
        <div class="nav-title">购物车({{$store.state.cartList.length}})</div>
      </div>
    </nav-bar>
    <Scroll class="content" ref="scroll">
      <div class="cart">
        <div class="cart-item" v-for="(item,index) in $store.state.cartList" :key="index">
          <check-button class="check" :is-checked="item.isChecked" @click.native="changeChecked(index)"></check-button>
          <div class="shop-info">
            <div class="image-box"><img :src="item.image" alt="cart_image"></div>
            <div class="info">
              <p class="title">{{item.title}}</p>
              <p class="price">{{item.price}}</p>
              <div class="button-box">
                <button class="reduce" :disabled="item.shopCount<=1" @click="reduceCount(index)">-</button>
                <span class="quantity">{{item.shopCount}}</span>
                <button class="add" @click="addCount(index)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Scroll>
    <settle-cart></settle-cart>
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
        this.$store.state.cartList[index].shopCount --
      },
      //增加数量
      addCount(index){
        //增加对应商品的数量
        this.$store.state.cartList[index].shopCount ++
      },
      changeChecked(index){
        this.$store.state.cartList[index].isChecked = !this.$store.state.cartList[index].isChecked
      }
    },
   activated() {
      //进入页面时刷新scroll
      this.$refs.scroll.scroll.refresh()
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
  }
  .cart{
    background-color: #ece6e6;
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
    flex: 9;
  }
  .image-box{
    flex: 1;
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
    height: 5rem;
  }
  .price{
    color: #e02929;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .button-box{
    text-align: right;
  }
</style>
