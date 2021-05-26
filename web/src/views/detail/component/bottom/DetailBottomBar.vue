<template>
  <div class="detail-bottom-bar">
    <div class="content">
      <div class="left">
        <div class="box">
          <div class="cart">
            <div class="image-box"><img src="~assets/image/detail/cart.png" alt="image"></div>
            <div class="button-box"><button><router-link :to="{path:'/cart'}">购物车</router-link></button></div>
          </div>
        </div>
        <div class="box">
          <div class="customer">
            <div class="image-box"><img src="~assets/image/detail/customer.png" alt="image"></div>
            <div class="button-box" @click="contactCustomer"><button>客服</button></div>
          </div>
        </div>
        <div class="box">
          <div class="favorite">
            <div class="image-box" v-if="!isCollected"><img src="~assets/image/detail/favorite.png" alt="image"></div>
            <div class="image-box" v-else><img src="~assets/image/detail/sweetHeart.png" alt="image"></div>
            <div class="button-box" @click="collectProduct"><button >收藏</button></div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="box">
          <div class="buy"><button>立即购买</button></div>
        </div>
        <div class="box">
          <div class="join-cart"><button @click="addCart">加入购物车</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailBottomBar",
  props:{
    isCollected:{
      type:Boolean,
      default(){
        return false
      }
    }
  },
  methods:{
    addCart(){
      this.$emit('addCart')
    },
    collectProduct() {
      this.$emit('collectProduct')
    },
    contactCustomer() {
      this.$toast.showToast('联系客服功能暂未开发')
    }
  }
}
</script>

<style scoped>
  .detail-bottom-bar{
    position: fixed;
    bottom:0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 10;
  }
  .content{
    display: flex;
    width: 100%;
    height: 3.1rem;
    text-align: center;
  }
  .left,.right{
    display: flex;
    flex: 1;
  }
  .box{
    flex: 1;
  }
  .left .box{
    border-right: 1px solid #e2dcdc;
  }
  .left button{
    font-size: 12px;
    background-color: transparent;
  }
  .right div{
    height: 100%;
  }
  img{
    height: 1.5rem;
    background-size: contain;
  }
  .buy button, .join-cart button{
    width: 100%;
    height: 100%;
    font-size: 1rem;
    color: #ffffff;
  }
  .buy button{
    background-color: #f00;
  }
  .join-cart button{
    background-color: #FFA500;
  }
</style>