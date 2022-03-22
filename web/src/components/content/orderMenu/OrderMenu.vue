<template>
  <div class="menu">
    <div class="menu-title">
      <h3>我的订单</h3>
    </div>
    <div class="menu-content">
      <div>
        <img :src="orderList['wait_pay']" alt="wait_pay">
        <p>待付款</p>
      </div>
      <div>
        <img :src="orderList['wait_receive_goods']" alt="wait_receive_goods">
        <p>待收货</p>
      </div>
      <div>
        <img :src="orderList['wait_comment']" alt="wait_comment">
        <p>待评价</p>
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
export default {
  name: "OrderMenu",
  props:{
    orderList:{
      type:Object,
      default(){
        return {}
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
   flex: 1;
 }
 .menu-content div img{
   width: 2rem;
 }
 .menu-content div p{
   margin: .5rem auto;
 }

</style>