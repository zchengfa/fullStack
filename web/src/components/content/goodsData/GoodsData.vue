<template>
  <div class="goods-data">
    <goods-data-item v-for="(item, index) in goods" :key="item[index]" :list="goods[index]" :id="index"></goods-data-item>
  </div>
</template>

<script>
  import GoodsDataItem from "@/components/content/goodsData/GoodsDataItem";

  export default {
    name: "GoodsData",
    props:{
      goods:{
        type:Array,
        default() {
          return []
        }
      },
      userCollections:{
        type:Array,
        default() {
          return [];
        }
      }
    },
    components:{
      GoodsDataItem
    }
  }
</script>

<style scoped>
  .goods-data{
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto 1rem;
    width: 90%;
    font-size: 14px;
    color: #a9a9a9;
    text-align: center;
    background-color: rgba(234,230,230,.3);
    border-radius: .4rem;
  }
  .goods-data div:last-child{
    float: left;
    margin-left: .5rem;
  }
</style>
