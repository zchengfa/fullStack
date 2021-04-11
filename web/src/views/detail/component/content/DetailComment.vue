<template>
  <div class="detail-comment">
    <div class="title">
      <h4>用户评论{{commentNum}}</h4>
    </div>
    <div class="err">评论数据暂无</div>
  </div>
</template>

<script>
export default {
  name: "DetailComment",
  props:{
    commentNum:{
      type:Number,
      default(){
        return 0
      }
    }
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
</style>