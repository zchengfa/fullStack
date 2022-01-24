<template>
  <div class="base">
    <div class="content">
      <div class="image-box">
        <img :src="baseData['product_image']" alt="bigImage">
      </div>
      <div class="introduction-box">
        <span  v-if="baseData.self_support" class="self-support">mall自营</span>
        <p class="price">
          <span><span class="price-character">￥</span>{{baseData.price}}</span>
          <span class="origin-price">{{originPrice}}</span>
          <label class="discount-label" for="discountTitle">折扣：</label>
          <span class="discount" id="discountTitle">{{baseData.discount}}折</span>
        </p>
        <p class="title">{{baseData.title || baseData['product_title']}}</p>
        <p class="other">
          <span class="comment-num">评论：{{baseData['comment_number']}}条</span>
          <span class="sell-num">销量：{{baseData['sales']}}件</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailBase",
  props:{
    baseData:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  computed:{
    originPrice(){
      return (this.baseData.price/this.baseData.discount).toFixed(2)
    }
  }
}
</script>

<style scoped>
.content{
  width: 100vw;
  overflow: hidden;
}
.image-box{
  margin: 1rem auto;
  width: 96%;
  height: 50vh;
  overflow: hidden;
}
.image-box img{
  width: 100%;
  background-size: contain;
}
.self-support{
  margin-left: 6vw;
  display: inline-block;
  padding: .1rem .2rem ;
  background-color: #ec053b;
  color: #fff;
  font-size: 12px;
  border-radius: .2rem;
}
p{
  margin: .8rem auto;
  width: 90%;
}
p.price{
  font-size: 1.3rem;
  font-weight: bold;
  color: #e02929;
}
.price-character{
  font-size: .9rem;
}
p.title{
  font-size: 1.1rem;
  font-weight: bolder;
}
p span.comment-num{
  padding-right: 4rem;
}
span.comment-num,span.sell-num{
  color: gray;
  font-size: .8rem;
}
.introduction-box .origin-price{
  text-decoration-line: line-through;
  font-size: .9rem;
  color: #8a8686;
}
.introduction-box .discount-label{
  display: inline-block;
  margin-left: 1rem;
  color: #8a8686;
  font-size: .8rem;
  font-weight: normal;
}
.introduction-box .discount{
  display: inline-block;
  padding-left:.2rem;
  font-size: 1rem;
  font-weight: normal;
}
</style>