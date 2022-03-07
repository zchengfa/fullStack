<template>
  <div>支付状态</div>
</template>

<script>
import {getAlipayPaymentStatus} from "@/network/cart";

export default {
  name: "PaymentStatus",
  data(){
    return {
      out_trade_no:'',
      trade_no:''
    }
  },
  methods:{
    getPaymentStatus(){
      getAlipayPaymentStatus(this.out_trade_no,this.trade_no).then(res=>{
        console.log(res)
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

</style>