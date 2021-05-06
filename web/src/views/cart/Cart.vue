<template>
	<div class="nav-cart">
    <nav-bar>
      <div slot="center">
        <div class="nav-title">购物车({{cartList.length}})</div>
      </div>
    </nav-bar>
    <Scroll v-if="cartList.length" class="content" ref="scroll">
      <div class="cart">
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
        cartList: this.$store.state.cartList
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
      else {
        //自定义插件显示购物车为空
        this.$empty.showEmpty('购物车空空如也...')
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
