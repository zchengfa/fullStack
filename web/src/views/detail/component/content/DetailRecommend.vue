<template>
  <div class="detail-recommend">
    <div class="title-box"><h4>商品推荐</h4></div>
    <goods-data :goods="recommendData"></goods-data>
  </div>
</template>

<script>
import GoodsData from "@/components/content/goodsData/GoodsData";
export default {
  name: "DetailRecommend",
  props:{
    recommendData:{
      type:Array,
      default(){
        return []
      }
    }
  },
  components:{
    GoodsData
  }
}
</script>

<style scoped>
  .title-box h4{
    text-indent: 1rem;
  }
</style>