<template>
<div class="wait-comments">
  <nav-bar class="nav">
    <div slot="left" @click="goBack">
      <img src="~assets/image/detail/back.svg" alt="back_icon">
    </div>
    <div slot="center">评价中心</div>
  </nav-bar>
  <Scroll class="content" ref="scroll">
    <div v-for="(item,index) in productsData" class="product-items" :key="index">
      <div v-for="(id,idIndex) in item['product_ids']" class="info" :key="idIndex" @click="itemClick(id,item['product_types'][index],item['sell_types'][index],index)">
        <div class="image-box">
          <img :src="item['product_image'][idIndex]" @load="imageLoadOver" alt="product_image">
        </div>
        <div class="product-info">
          <p>{{item['product_title'][idIndex]}}</p>
          <p>评完最多可获得<span>20</span>mall豆</p>
        </div>
      </div>
      <button @click="comments(item['order_id'])">评价</button>
    </div>
  </Scroll>
</div>
</template>

<script>
import {backPreviousPageMixins} from "@/common/mixins/mixins";
import NavBar from "@/components/common/navbar/NavBar.vue";
import Scroll from "@/components/common/scroll/Scroll.vue";
import {getUserWaitCommentsOrder} from "@/network/cart";

export default {
  name: "Comments",
  mixins:[backPreviousPageMixins],
  components:{
    NavBar,
    Scroll
  },
  data(){
    return {
      productsData:[]
    }
  },
  methods:{
    getUserWCOrder(){
      getUserWaitCommentsOrder(this.$store.state.userInfo.user_id).then(res=>{
        this.productsData = res.data
      })
    },
    imageLoadOver(){
      this.$refs.scroll.scroll.refresh()
    },
    itemClick(id,product_type,sell_type,index){
      //动态路由传参(先要从父组件传入id和type给子组件)
      this.$router.push('/detail/'+sell_type+'/'+product_type +'/'+id+'/'+index)
    },
    comments(order_id){
      this.$router.push({path:'/comments',query:{'order_id':order_id}})
    }
  },
  created() {
    this.getUserWCOrder()
  }
}
</script>

<style scoped>
.wait-comments{
  position: relative;
  height: 100vh;
  background-color: #fff;
  z-index: 11;
}
.nav div{
  height: 100%;
  overflow: hidden;
}
.nav div img{
  position: relative;
  margin-top:25%;
  transform: translateY(-25%);
}
.content{
  height: calc(100vh - 44px);
  overflow: hidden;
}
.content .image-box img{
  width: 6rem;
}
.content .product-items{
  border-bottom: 1px solid #8a8686;
}
.product-items::after{
  display: block;
  content: '';
  height: 0;
  clear: both;
  visibility: hidden;
}
.content .info{
  display: flex;
  align-items: center;
  justify-items: center;
  margin: 1rem auto;
  width: 94%;
}
.info .product-info{
  margin-left: 1rem;
}
.product-info p:nth-child(2){
  color: #8a8686;
}
.product-info span{
  color: #fd001e;
}
.product-items button {
  padding: .2rem .8rem;
  float: right;
  margin-right: 1rem;
  margin-bottom: .5rem;
  color: #fd001e;
  border: 1px solid #fd001e;
  border-radius: 1rem;
}
</style>