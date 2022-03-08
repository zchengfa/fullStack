<template>
  <div class="payment-status">
    <div v-show="payment_status===1">
      <div><span>您已付款成功，等待卖家发货</span></div>
      <router-link :to="{path:'/order'}" class="link">查看订单</router-link>
    </div>
  </div>
</template>

<script>
import {getAlipayPaymentStatus} from "@/network/cart";

export default {
  name: "PaymentStatus",
  data(){
    return {
      out_trade_no:'',
      trade_no:'',
      payment_status:''
    }
  },
  methods:{
    getPaymentStatus(){
      getAlipayPaymentStatus(this.out_trade_no,this.trade_no).then(res=>{
        this.payment_status = res.data.code
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  created() {
    this.out_trade_no = this.$route.query.out_trade_no
    this.trade_no = this.$route.query.trade_no;

    (this.out_trade_no&&this.trade_no)?this.getPaymentStatus():null
  }
}
</script>

<style scoped>
.payment-status{
  text-align: center;
}
.link{
  display: inline-block;
  padding: .5rem 1rem;
  border-radius: .5rem;
  background-color: #fd001e;
}
</style>