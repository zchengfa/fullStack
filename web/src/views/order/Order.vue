<template>
  <div class="submit-order">
    <nav-bar class="nav">
      <div slot="left" @click="back" class="back">
        <img src="~assets/image/detail/back.svg" alt="back">
        <span>确认订单</span>
      </div>
    </nav-bar>
    <Scroll class="content" ref="scroll">
      <div class="scroll-content">
        <div class="user-address">
          <div class="location-image" v-show="address.length"><img src="~assets/image/order/location.png" alt="location"></div>
          <div class="address-info" v-show="address.length" v-for="(item,index) in address" :key="index">
            <p class="location">{{item.region+item['complete_address']}}</p>
            <span clss="user-name user-info">{{item.username}}</span>
            <span class="user-phone user-info">{{item.phone.replace(/(\d{3})\d*(\d{4})/,'$1****$2')}}</span>
          </div>
          <div class="none-address" v-show="!address.length"><button @click="addAddress" >+添加收货地址</button></div>
        </div>
        <div class="product-info">
          <div class="info" v-for="(item,index) in goodsList" :key="index">
            <div class="base" @click="viewProductDetail(item.sell_type,item.product_id,item.product_type,index+1)">
              <div class="image-box"><img @load="imageLoadOver" :src="item['product_image']" alt="product_image"></div>
              <div class="product-message">
                <div class="title-price">
                  <span class="title">{{item['product_title']}}</span>
                  <span class="price"><span class="price-character">￥</span>{{item['price']}}</span>
                </div>
                <div class="size"><span>尺码：{{item['size']}}</span></div>
                <div class="num"><span>x{{item['quantity']}}</span></div>
              </div>
            </div>
            <div class="other">配送服务</div>
            <div class="other">店铺优惠</div>
            <div class="other">开具发票</div>
            <div class="other">订单备注</div>
          </div>
        </div>
        <div class="price-detail">
          <h4>价格明细</h4>
          <div class="total-price">
            <span>商品总价</span>
            <span>共{{goodsList.length}}件宝贝</span>
            <span class="price-character">￥</span>
            <span>{{total_price}}</span>
          </div>
          <div class="last-price">
            <span>合计</span>
            <span><span class="price-character">￥</span>{{total_price}}</span>
          </div>
        </div>
        <div class="payment-way" v-show="payment_status===0">
          <h4>选择支付方式</h4>
          <div><img src="~assets/image/order/alipay.png" alt="alipay"><span>支付宝支付</span><input type="radio" name="payment" value="1" v-model="payment"></div>
          <div><img src="~assets/image/order/wechat.png" alt="wechat"><span>微信支付</span><input type="radio" name="payment" value="2" v-model="payment"></div>
        </div>

      </div>
    </Scroll>
    <div class="confirm-submit">
      <div>
        <span class="num">共{{goodsList.length}}件</span>
        <span>合计</span>
        <span class="price"><span class="price-character">￥</span>{{total_price}}</span>
      </div>
      <div>
        <button v-show="payment_status===0" @click="confirmSubmitOrder">提交订单</button>
        <button v-show="payment_status===1">已付款</button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import Scroll from "@/components/common/scroll/Scroll";
import {getUserOrderInfo,alipayRequest} from "@/network/cart";
import {getUserAddress} from "../../network/profile";
export default {
  name: "order",
  components:{
    NavBar,
    Scroll
  },
  data(){
    return {
      order_id:'',
      goodsList:[],
      user_id:'',
      payment:'1',
      payment_status:0,
      address:[]
    }
  },
  computed:{
    total_price(){
      let price = 0
      this.goodsList.map(item=>{
        (price += item['quantity'] * item['price']).toFixed(2)
      })
      return Number(price.toFixed(2))
    }
  },
  methods:{
    //返回上一页
    back() {
      this.$router.go(-1)
    },
    //使用后端返回的订单编号来获取当前用户的订单信息
    getOrderInfoByOrderId(user_id,order_id){
      getUserOrderInfo(user_id,order_id).then(res =>{
        this.goodsList = res.data.info_arr
        this.payment_status = res.data.payment_status
        //console.log(res.data)
      }).catch(err=>{
        console.log(err)
      })
    },
    imageLoadOver(){
      this.$refs.scroll.refresh()
    },
    //点击提交订单按钮，进行订单处理
    confirmSubmitOrder(){
      if (this.address.length){
        //判断payment的值，若等于1则是支付宝支付，若是2则是微信支付
        if (this.payment==='1'){
          let nameArr = []
          this.goodsList.map(item=>{
            nameArr.push(item.product_title)
          })

          let orderObj = {
            order_id:this.order_id,
            total_price:this.total_price,
            name:nameArr
          }
          this.alipayRequestFun(orderObj)
        }
        else if(this.payment==='2'){
          this.$toast.showToast('暂未提供微信支付功能，请期待后续完善')
        }
      }
      else{
        this.$router.push('/addAddress')
      }
    },
    alipayRequestFun(order){
      alipayRequest(order).then(res=>{
        window.location.href = res.data.paymentUrl
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    },
    getDefaultAddress(){
      getUserAddress(this.user_id,1).then(res=>{
        res.data?this.address=res.data:null
      })
    },
    addAddress() {
      this.$router.push('/addAddress')
    },
    //点击商品查看商品详情
    viewProductDetail(sell_type,product_id,product_type,id){
      this.$router.push('/detail/'+sell_type+'/'+product_type +'/'+(product_id)+'/'+id)
    }
  },
  created() {
    this.order_id = this.$store.state.order_id
    this.user_id = this.$store.state.userInfo.user_id;
    (this.order_id && this.user_id)?this.getOrderInfoByOrderId(this.user_id,this.order_id):null
    this.user_id?this.getDefaultAddress():null
  },
  mounted() {

  }
}
</script>

<style scoped>
.submit-order{
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: #efe5e5;
  z-index: 11;
}
.nav{
  color: #FFFFFF;
  background-color: #fa5065;
}
.back,.user-address,.product-info .base{
  display: flex;
  align-items: center;
  justify-items: center;
}
.back{
  width: 7rem;
  font-size: .9rem;
}
.content{
  height: calc(100vh - 45px - 4rem);
  overflow: hidden;
}
.scroll-content{
  padding-bottom: 2rem;
}
.user-address,.product-info,.price-detail, .payment-way{
  position: relative;
  margin: 1rem auto;
  width: 96%;
  text-align: center;
  border-radius: .5rem;
  background-color: #FFFFFF;
  transform: translateY(1rem);
}
.user-address .location-image{
  flex: 1;
}
.user-address .address-info{
  flex: 9;
  text-align: left;
  text-indent: .5rem;
}
.user-address{
  padding:1rem;
  border-bottom: .2rem solid transparent;
  border-top: #fff;
  border-left: #fff;
  border-right: #fff;
  background: linear-gradient(white,white) padding-box,repeating-linear-gradient(-45deg, red 0, red 12.5%, transparent 0, transparent 25%, #58a 0, #58a 37.5%, transparent 0, transparent 50%) 0/5rem 5rem;
}
.address-info .location{
  font-weight: bolder;
}
.none-address{
  padding: 1.5rem;
  text-align: center;
}
.none-address button{
  border-radius: .5rem;
  border: 1px solid #e71919;
  height: 2rem;
  color: #e71919;
}
.user-address .address-info span{
  display: inline-block;
  margin-bottom: 1rem;
  padding: .2rem;
  color: #8a8686;
}
.address-info span.user-info{
  margin-left: .5rem;
}
.base .image-box{
  flex: 2;
}
.base .image-box img{
  width: 4rem;
}
.base .product-message{
  flex: 8;
}
.product-info{
  background-color: #efe5e5;
}
.info{
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: .5rem;
}
.info .product-message .title-price span{
  position: relative;
  display: inline-block;
  height: 100%;
  text-align: left;
}
.info .product-message .title-price .price{
  position:relative;
  width: 30%;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
}
.price-character{
  font-size: .8rem;
}
.title-price .title{
  width:70%;
}
.size,.num{
  margin-top: .5rem;
  text-align: right;
  font-size: .9rem;
}
.size span,.num span{
  margin-right: 1rem;
  color: #a89d9f;
}
.other{
  margin: 1rem auto;
  text-align: left;
  text-indent: 1rem;
}
.price-detail{
  padding-bottom: 1rem;
}
h4{
  margin: 0 auto;
  padding: 1rem;
  text-align: left;
}
.total-price{
  text-align: left;
}
.total-price span{
  display: inline-block;

}
.total-price span:nth-child(1){
  margin-left: 1rem;
}
.total-price span:nth-child(2){
  margin-left: .5rem;
  color: #8a8686;
}
.total-price span:nth-child(3){
  margin-left: 9rem;
}
.total-price span:nth-child(4){
  font-weight: bolder;
}
.last-price{
  margin-top: 1rem;
  text-align: left;
}
.last-price span{
  display: inline-block;
}
.last-price span:nth-child(1){
  margin-left: 1rem;
}
.last-price span:nth-child(2){
  float: right;
  margin-right: 2rem;
}
.payment-way div{
  padding-bottom: 1rem;
  text-align: left;
}
.payment-way span,.payment-way img{
  display: inline-block;
  margin-left: 1rem;
  height: 2rem;
  line-height: 2rem;
}
.payment-way span{
  position: relative;
  top:-1rem;
  transform: translateY(.5rem);
}
.payment-way input{
  float: right;
  margin-right: 1rem;
  margin-top:.5rem;
  width: 1.4rem;
  height: 1.42rem;
}
.confirm-submit{
  display: flex;
  align-items: center;
  justify-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 4rem;
  background-color: #fff;
  text-align: center;
}
.confirm-submit div{
  flex: 1;
}
.confirm-submit div:first-child{
  flex: 2;
}
.confirm-submit div button{
  width: 80%;
  height: 2.5rem;
  background-color: #fd4c00;
  color: #fff;
  border-radius: 1.5rem;
}
.confirm-submit div button:last-child{
  background-color: #8a8686;
}
.confirm-submit .price{
  font-weight: bolder;
  font-size: 1.4rem;
  color: #f52f0c;
}
.confirm-submit .num{
  margin-right: .4rem;
  color: #8a8686;
}
</style>