<template>
  <div class="menu">
    <div class="menu-title">
      <h3>我的订单</h3>
    </div>
    <div class="menu-content">
      <div @click="toOrderStatus('wait_pay')">
        <img :src="orderList['wait_pay']" alt="wait_pay">
        <p>待付款</p>
        <Bubble class="bubble" :count="orderCount['wait_pay']"></Bubble>
      </div>
      <div @click="toOrderStatus('wait_receive')">
        <img :src="orderList['wait_receive_goods']" alt="wait_receive_goods">
        <p>待收货</p>
        <Bubble class="bubble" :count="orderCount['wait_receive']"></Bubble>
      </div>
      <div @click="toComments">
        <img :src="orderList['wait_comment']" alt="wait_comment">
        <p>待评价</p>
        <Bubble class="bubble" :count="orderCount['wait_comments']"></Bubble>
      </div>
      <div>
        <img :src="orderList['exchange_return']" alt="exchange_return">
        <p>退货/售后</p>
      </div>
      <div>
        <img :src="orderList['all_order']" alt="all_order">
        <p>全部订单</p>
      </div>
    </div>
  </div>
</template>

<script>
import Bubble from "@/components/common/bubble/Bubble";
export default {
  name: "OrderMenu",
  props:{
    orderList:{
      type:Object,
      default(){
        return {}
      }
    },
    orderCount:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  components:{
    Bubble
  },
  methods:{
    toOrderStatus(status){
      if (this.$store.state.token){
        this.$router.push({path:'/orderStatus',query:{'orderStatus':status}})
      }
      else{
        this.$router.push('/login')
      }
    },
    toComments(){
      if (this.$store.state.token){
        this.$router.push('/waitComments')
      }
      else{
        this.$router.push('/login')
      }

    }
  }
}
</script>

<style scoped>
 .menu {
   padding: 1rem 0;
   margin-top: 1rem;
   margin-left: auto;
   margin-right: auto;
   width: 96vw;
   max-width: 500px;
   font-size: .8rem;
   text-align: center;
   border-radius: .5rem;
 }
 .menu h3{
   margin: 1rem auto;
   text-align: left;
   text-indent: 1rem;
 }
 .menu-content{
   display: flex;
   justify-items: center;
   align-items: center;
 }
 .menu-content div{
   position: relative;
   flex: 1;
 }
 .menu-content div .bubble{
   position: absolute;
   top:0;
   left: 55%;
 }
 .menu-content div img{
   margin-top: .32rem;
   width: 2rem;
 }
 .menu-content div p{
   margin: .5rem auto;
 }

</style>