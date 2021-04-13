<template>
	<div class="nav-cart">
    <nav-bar>
      <div slot="center">
        <div class="nav-title">购物车</div>
      </div>
    </nav-bar>
    <div class="cart">
      <div class="cart-item" v-for="(item,index) in shopData" :key="index">
        <div class="shop-info">
          <div class="image-box"><img :src="item.image" alt="cart_image"></div>
          <div class="info">
            <p class="title">{{item.title}}</p>
            <p class="price">{{item.price}}</p>
          </div>
        </div>
        <div class="button-box">
          <button class="reduce" :disabled="item.shopCount<=1" @click="reduceCount(index)">-</button>
          <span class="quantity">{{item.shopCount}}</span>
          <button class="add" @click="addCount(index)">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NavBar from "@/components/common/navbar/NavBar"

  export  default {
    name:'Cart',
    data(){
      return {
        shopData:[]
      }
    },
    components:{
      NavBar
    },
    methods:{
      //减少数量
      reduceCount(index){
        console.log(index)
      },
      //增加数量
      addCount(index){
        console.log(index)
      }
    },
    created() {
      this.shopData = this.$store.state.cartList
    }
  }
</script>

<style scoped>
  .nav-bar{
    background-color: #db7093;
  }
  .nav-title{
    color: #fff;
  }
  .cart{
    background-color: #ece6e6;
  }
  .cart-item{
    margin:1rem auto;
    width: 90vw;
  }
  .shop-info{
    display: flex;
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
