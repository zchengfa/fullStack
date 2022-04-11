<template>
  <div class="comment">
    <div class="title">
      <h4>用户评论<span>{{$props.commentNum}}</span></h4>
      <span v-show="$props.comments.length" class="percent">好评度{{$props.praiseDegree}}</span>
    </div>
    <div class="comments-box">
      <div v-show="$props.comments.length" class="comments-item" v-for="(item,index) in $props.comments" :key="index">
        <div class="userInfo-box">
          <div class="avatar-box"><img :src="item.avatar" alt="avatar"></div>
          <div class="name-stars">
            <span>{{item.username || item.account}}</span>
            <comment-stars :disabled="true" :stars-num="item.stars"></comment-stars>
          </div>
        </div>
        <div class="comments-time">{{item['comments_time']}}</div>
        <div class="comments-data">
          <p>{{item['comments_text']}}</p>
          <span>购买的尺码/规格：{{item.size}}</span>
<!--          后期添加图片以及视频评价-->
        </div>
      </div>
    </div>
    <div class="err" v-show="!$props.comments.length">暂无评价</div>
  </div>
</template>

<script>
import CommentStars from "@/components/content/commentStars/CommentStars.vue";
export default {
  name: "DetailComment",
  props:{
    commentNum:{
      type:Number,
      default(){
        return 0
      }
    },
    comments:{
      type:Array,
      default() {
        return [];
      }
    },
    praiseDegree:{
      type:String,
      default(){
        return ''
      }
    }
  },
  components:{
    CommentStars
  }
}
</script>

<style scoped>
  .err{
    margin: 0 auto;
    width: 96%;
    text-indent: 1rem;
    color: #e2dcdc;
  }
  .title::after{
    display: block;
    content: '';
    height: 0;
    clear: both;
    visibility: hidden;
  }
  h4{
    float: left;
  }
  h4 span{
    margin-left: .5rem;
    font-weight: normal;
    font-size: .8rem;
  }
  .percent{
    display: block;
    float: right;
    margin-top: 1.2rem;
    margin-right: 1.4rem;
    font-size: .8rem;
    color: #8a8686;
    letter-spacing: .1rem;
  }
  .userInfo-box{
    display: flex;
    justify-items: center;
    align-items: center;
  }
  .avatar-box img{
    width: 2.4rem;
    border-radius: 50%;
  }
  .comments-time{
    position: absolute;
    top: 1rem;
    right: 0;
    font-size: .9rem;
    color: #8a8686;
  }
  .comments-box .comments-item{
    position: relative;
    margin: 0 auto;
    padding: 1rem 0;
    width: 92%;
    border-bottom: 1px solid #e5dddd;
    overflow: hidden;
  }
  .comments-data span{
    color: #bdb7b7;
    font-size: .8rem;
  }
  .comments-data p{
    margin-top: .5rem;
    margin-bottom: .5rem;
  }
</style>