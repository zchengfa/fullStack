<template>
  <div class="recommend">
    <div :class="{alignCenter:alignCenter}" class="title"><h4>{{ recommendTitle }}</h4></div>
    <goods-data :goods="recommendData"></goods-data>
  </div>
</template>

<script>
import GoodsData from "@/components/content/goodsData/GoodsData";
export default {
  name: "Recommend",
  props:{
    recommendData:{
      type:Array,
      default(){
        return []
      }
    },
    currentType:{
      type:String,
      default(){
        return ''
      }
    },
    recommendTitle:{
      type:String,
      default() {
        return '推荐标题';
      }
    },
    alignCenter:{
      type:Boolean,
      default(){
        return false
      }
    }
  },
  components:{
    GoodsData
  }
}
</script>

<style scoped>
.alignCenter h4{
  text-align: center;
}

</style>