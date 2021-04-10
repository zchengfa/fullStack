<template>
  <div class="detail-base">
    <div class="content">
      <div class="image-box">
        <img :src="baseData.bigImage" alt="bigImage">
      </div>
      <div class="introduction-box">
        <p class="price">{{baseData.price}}</p>
        <p class="title">{{baseData.title}}</p>
        <p class="other">
          <span class="comment-num">评论：{{baseData.comment_num}}条</span>
          <span class="sell-num">销量：{{baseData.sell_num}}件</span>
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
p{
  margin: .8rem auto;
  width: 90%;
}
p.price{
  color: #e02929;
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
</style>