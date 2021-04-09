<template>
  <div class="detail-content">
    <div class="content">
      <div class="base-content" v-if="JSON.stringify(detailData) !=='{}'">
        <div class="image-box"><img :src="detailData.bigImage" alt="image"></div>
        <div class="introduction-box">
          <p class="price">{{detailData.price}}</p>
          <p class="title">{{detailData.title}}</p>
          <p class="other">
            <span class="comment-num">评论：{{detailData.comment_num}}</span>
            <span class="sell-num">销量：{{detailData.sell_num}}件</span>
          </p>
        </div>
        <div class="image-detail">
          <div class="image-detail-title"><h4>图文详情</h4></div>
          <div class="image-detail-box" v-for="(item, index) in detailData.imageDetail" :key="index">
            <img :src="item.imagePath" alt="image_detail" @load="loadOver">
          </div>
        </div>
      </div>
      <div class="message" v-else>
        <div class="err-image"><img src="~assets/image/home/errDetail/no_data.png" alt="err"></div>
        <div class="err-message">没有数据哦！</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DetailContent",
    props:{
      detailData:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data(){
      return {

      }
    },
    methods:{
      loadOver(){
        this.$emit('imageLoadOver')
      }
    }
  }
</script>

<style scoped>
  .detail-content{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
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
  .message{
   text-align: center;
  }
  .err-image{
    width: 100%;
    background-size: contain;
  }
  .image-detail{
    margin: 1rem auto 4rem;
    width: 96%;
    border-top: .1rem solid #e3dede;
    border-bottom: .1rem solid #e3dede;
    overflow: hidden;
  }
  .image-detail-title h4{
    text-indent: 1rem;
  }
  .image-detail-box img{
    width: 100%;
    background-size: contain;
  }
</style>
