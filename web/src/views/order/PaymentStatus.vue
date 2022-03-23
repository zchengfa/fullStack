<template>
  <div class="payment-status">
    <Scroll ref="scroll" class="content">
			<div class="payment-result" v-show="payment_status===1">
			  <div><span>您已付款成功，等待卖家发货</span></div>
			  <router-link :to="{path:'/order'}" class="link">查看订单</router-link>
			</div>
			<Recommend class="recommend" :align-center="true" :recommend-data="recommendData" recommend-title="精品推荐"></Recommend>
		</Scroll>
  </div>
</template>

<script>
import {getAlipayPaymentStatus,getCommonRecommend,getUserRecommend} from "@/network/cart";
import Scroll from '@/components/common/scroll/Scroll.vue'
import Recommend from '@/components/content/recommend/Recommend.vue'
import {refreshScrollMixins} from '@/common/mixins/mixins'

export default {
  name: "PaymentStatus",
	mixins:[refreshScrollMixins],
  data(){
    return {
      out_trade_no:'',
      trade_no:'',
      payment_status:'',
			recommendData:[]
    }
  },
	components:{
		Scroll,
		Recommend
	},
  methods:{
    getPaymentStatus(){
      getAlipayPaymentStatus(this.out_trade_no,this.trade_no).then(res=>{
        this.payment_status = res.data.code
      }).catch(err=>{
        console.log(err)
      })
    },
		getCRecommend(){
			getCommonRecommend().then(res=>{
				this.recommendData = res.data.commonRecommend
			})
		},
		getURecommend(user_id){
			getUserRecommend(user_id).then(res=>{
				this.recommendData = res.data
			})
		}
  },
  created() {
    this.out_trade_no = this.$route.query.out_trade_no
    this.trade_no = this.$route.query.trade_no;

    (this.out_trade_no&&this.trade_no)?this.getPaymentStatus():null
		
		this.$store.state.token?this.getURecommend(this.$store.state.userInfo.user_id):this.getCRecommend()
  },
	
}
</script>

<style scoped>
.payment-status{
	height: 100vh;
	overflow: hidden;
  text-align: center;
}
.link{
  display: inline-block;
	margin-top: 1rem;
  padding: .5rem 1rem;
  border-radius: .5rem;
  background-color: #fd2f55;
}
.content{
	height: calc(100vh - 44px);
	overflow: hidden;
}
.recommend{
	padding-bottom: 6rem;
}
.payment-result{
	padding: 1rem 0;
}

.payment-result div span{
	color: #8a8a8a;
}

</style>